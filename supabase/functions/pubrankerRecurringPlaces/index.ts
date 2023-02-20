// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.8.0';

const RADIUS = 1000;
const MIN_LAT = 51.276092;
const MAX_LAT = 51.698523;

const MIN_LNG = -0.535085;
const MAX_LNG = 0.30317;

type OpeningHoursObject = {
    day: number;
    time: string;
};

type PlaceType = {
    name: string;
    address: string;
    longitude: number;
    latitude: number;
    opening_hours: { open: OpeningHoursObject; close: OpeningHoursObject }[];
    phone_number: string;
    google_overview: string;
    google_photos: string[];
    google_rating: number;
    google_ratings_amount: number;
    google_id: string;
    reservable: boolean;
    website: string;
};

const generateLocation = (): { lat: number; lng: number } => {
    const latDistance = (MAX_LAT - MIN_LAT) * 1_000_000;
    const latRand = Math.floor(Math.random() * latDistance) / 1_000_000;
    const lat = MIN_LAT + latRand;

    const lngDistance = (MAX_LNG - MIN_LNG) * 1_000_000;
    const lngRand = Math.floor(Math.random() * lngDistance) / 1_000_000;
    const lng = MIN_LNG + lngRand;

    return { lat, lng };
};

const attemptNearbySearch = (
    key: string,
    amountCalled: number,
    pagetoken?: string,
): Promise<any> => {
    const NUM_TRIES = 3;
    const TIME_TO_AWAIT = 1000;

    // deno-lint-ignore no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        if (amountCalled < NUM_TRIES) {
            try {
                const URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${key}&location=${Object.values(
                    generateLocation(),
                ).join(',')}&radius=${RADIUS}&type=bar${
                    pagetoken ? `&pagetoken=${pagetoken}` : ''
                }`;

                const nearbyResponse = await (await fetch(URL)).json();

                if (nearbyResponse.status !== 'OK') {
                    throw new Error(nearbyResponse.status);
                }

                resolve(nearbyResponse);
            } catch (err) {
                console.warn(err, amountCalled);
                setTimeout(async () => {
                    const r = await attemptNearbySearch(
                        key,
                        amountCalled + 1,
                        pagetoken,
                    ).catch(() => reject());

                    if (r) {
                        resolve(r);
                    }

                    reject();
                }, TIME_TO_AWAIT);
            }
        } else {
            reject();
        }
    });
};

const getPage = async (key: string, pagetoken?: string): Promise<any> => {
    const places: PlaceType[] = [];

    const nearbyResponse = await attemptNearbySearch(key, 0, pagetoken);

    if (!nearbyResponse) {
        throw new Error(`Error getting page: ${pagetoken}`);
    }

    const promises: Promise<any>[] = [];

    nearbyResponse.results.forEach((nearbyPlace: any) => {
        const URL = `https://maps.googleapis.com/maps/api/place/details/json?key=${key}&place_id=${nearbyPlace.place_id}`;
        promises.push(fetch(URL).then(async res => await res.json()));
    });

    const detailsResponse = await Promise.allSettled(promises);

    detailsResponse.forEach(placeDetails => {
        if (placeDetails.status === 'fulfilled') {
            const p = placeDetails.value.result;

            try {
                if (
                    !p.name ||
                    !p.formatted_address ||
                    !p.geometry ||
                    !p.opening_hours ||
                    !p.formatted_phone_number ||
                    !p.photos ||
                    !p.rating ||
                    !p.user_ratings_total ||
                    !p.place_id ||
                    !p.website
                ) {
                    throw new Error('Incorrect format');
                }

                p.opening_hours.periods.forEach((oh: any) => {
                    if (!oh.close) {
                        throw new Error('No close date');
                    }
                });

                places.push({
                    name: p.name,
                    address: p.formatted_address,
                    latitude: p.geometry.location.lat,
                    longitude: p.geometry.location.lng,
                    opening_hours: p.opening_hours.periods.map(
                        (period: any) => ({
                            open: {
                                day: period.open.day,
                                time: period.open.time || '0000',
                            },
                            close: {
                                day: period.close?.day || 0,
                                time: period.close?.time || '0000',
                            },
                        }),
                    ),
                    phone_number: p.formatted_phone_number,
                    // @ts-ignore 2339
                    google_overview: p.editorial_summary?.overview,
                    google_photos: p.photos.map(
                        (photo: { photo_reference: string }) =>
                            photo.photo_reference,
                    ),
                    google_rating: p.rating,
                    google_ratings_amount: p.user_ratings_total,
                    google_id: p.place_id,
                    // @ts-ignore 2339
                    reservable: p.reservable || false,
                    website: p.website,
                });
            } catch {
                console.warn('ERROR ADDING PRODUCT:', p);
            }
        }
    });

    return {
        pagetoken: nearbyResponse.next_page_token,
        places,
    };
};

const getPlaces = async (key: string) => {
    let places: PlaceType[] = [];
    let token = '';

    while (true) {
        const response = await getPage(key, token).catch(() => ({
            places: [],
            pagetoken: '',
        }));

        places = [...places, ...response.places];

        console.log('PLACES', places.length);

        if (token === response.pagetoken || !response.pagetoken) {
            break;
        }

        token = response.pagetoken;
    }

    return places;
};

serve(async req => {
    const data = await getPlaces(Deno.env.get('GOOGLE_MAPS_KEY') || '');

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') || '',
        Deno.env.get('SUPABASE_ANON_KEY') || '',
        {
            global: {
                headers: { Authorization: req.headers.get('Authorization')! },
            },
        },
    );

    const res = await supabase.from('pubs').insert(data);
    console.log(res);

    return new Response(JSON.stringify(res), {
        headers: { 'Content-Type': 'application/json' },
    });
});
