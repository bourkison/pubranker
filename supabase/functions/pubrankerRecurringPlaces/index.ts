// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RADIUS = 1000;
const LOCATION = { lat: 51.55241, lng: -0.05702 };

type OpeningHoursObject = {
    day: number;
    time: string;
};

type PlaceType = {
    name: string;
    address: string;
    location: {
        type: 'Point';
        coordinates: number[];
    };
    openingHours: { open: OpeningHoursObject; close: OpeningHoursObject }[];
    phoneNumber: string;
    googleOverview: string;
    googlePhotos: string[];
    googleRating: number;
    googleRatingsAmount: number;
    googleId: string;
    reservable: boolean;
    website: string;
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
                    LOCATION,
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
                    location: {
                        type: 'Point',
                        coordinates: [
                            p.geometry.location.lat,
                            p.geometry.location.lng,
                        ],
                    },
                    openingHours: p.opening_hours.periods.map(
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
                    phoneNumber: p.formatted_phone_number,
                    // @ts-ignore 2339
                    googleOverview: p.editorial_summary?.overview,
                    googlePhotos: p.photos.map(
                        (photo: any) => photo.photo_reference,
                    ),
                    googleRating: p.rating,
                    googleRatingsAmount: p.user_ratings_total,
                    googleId: p.place_id,
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

serve(async () => {
    const data = await getPlaces(Deno.env.get('GOOGLE_MAPS_KEY') || '');

    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
    });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
