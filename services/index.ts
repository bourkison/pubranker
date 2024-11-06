import { OpeningHoursType, PubFilters } from '@/types';
import { Database } from '@/types/schema';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import * as turf from '@turf/turf';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const convertPointStringToObject = (
    input: string,
): { lat: number; lng: number } => {
    const firstIndex = input.indexOf('(');
    const secondIndex = input.indexOf(')');

    if (firstIndex < 0 || secondIndex < 0) {
        throw new Error('No brackets found.');
    }

    const arr = input
        .substring(firstIndex + 1, secondIndex)
        .split(' ')
        .map(i => parseFloat(i));

    return {
        lng: arr[0],
        lat: arr[1],
    };
};

export const parseLocation = (locationString: string): turf.helpers.Point => {
    const location: turf.helpers.Point = JSON.parse(locationString);

    if (!location?.coordinates || location.coordinates.length !== 2) {
        throw new Error('Invalid coordinates array provided');
    }

    return location;
};

export const parseOpeningHours = (openingHours: any): OpeningHoursType[] => {
    let oh: OpeningHoursType[];

    if (typeof openingHours === 'object') {
        oh = openingHours;
    } else if (typeof openingHours === 'string') {
        oh = JSON.parse(openingHours);
    } else {
        throw new Error('Unrecognised type');
    }

    let response: OpeningHoursType[] = [];

    for (let i = 0; i < oh.length; i++) {
        const openingHour = oh[i];

        if (
            openingHour.close_day === undefined ||
            openingHour.close_day === null
        ) {
            console.warn('No close day at index', i, oh[i]);
            continue;
        }

        if (
            openingHour.open_day === undefined ||
            openingHour.open_day === null
        ) {
            console.warn('No open day at index', i, oh[i]);
            continue;
        }

        if (
            openingHour.close_hour === undefined ||
            openingHour.close_hour === null
        ) {
            console.warn('No close hour at index', i, oh[i]);
            continue;
        }

        if (
            openingHour.open_hour === undefined ||
            openingHour.open_hour === null
        ) {
            console.warn('No open hour at index', i, oh[i]);
            continue;
        }

        response.push(openingHour);
    }

    return response;
};

export const dayString = (input: number): string => {
    switch (input) {
        case 0:
            return 'Sunday';
        case 1:
            return 'Monday';
        case 2:
            return 'Tuesday';
        case 3:
            return 'Wednesday';
        case 4:
            return 'Thursday';
        case 5:
            return 'Friday';
        case 6:
            return 'Saturday';
        default:
            console.warn('Undefined day', input);
            return 'undefined';
    }
};

export const timeString = (input: string): string => {
    let dayjsInput = '';

    for (let i = 0; i < 4 - input.length; i++) {
        dayjsInput += '0';
    }

    dayjsInput += input;

    const hour = parseInt(dayjsInput.substring(0, 2), 10);
    const minute = parseInt(dayjsInput.substring(2, 4), 10);

    if (isNaN(hour) || isNaN(minute)) {
        throw new Error(
            `Not a number, input: ${dayjsInput}, hour: ${hour}, minute: ${minute}`,
        );
    }

    const response = dayjs().hour(hour).minute(minute);

    let output = response.format('h');

    if (response.format('mm') !== '00') {
        output += `:${response.format('mm')}`;
    }

    output += response.format('a');

    return output;
};

export const roundToNearest = (input: number, nearest: number): number => {
    return Math.ceil(input / nearest) * nearest;
};

export const distanceString = (input: number): string => {
    // TODO: Miles vs Metric.

    const amount = roundToNearest(input, 10);

    if (amount >= 1000) {
        return `${roundToNearest(amount, 100) / 1000}km away`;
    } else {
        return `${amount}m away`;
    }
};

export const applyFilters = (
    query: PostgrestFilterBuilder<
        Database['public'],
        Database['public']['Functions']['nearby_pubs']['Returns'][number],
        any
    >,
    filters: PubFilters,
    searchText: string,
): PostgrestFilterBuilder<any, any, any> => {
    if (searchText) {
        query = query.textSearch('name', `'${searchText.toLowerCase()}'`, {
            type: 'websearch',
        });
    }

    if (filters.dogFriendly !== 'unset') {
        query = query.eq('dog_friendly', filters.dogFriendly);
    }

    if (filters.liveSport !== 'unset') {
        query = query.eq('live_sport', filters.liveSport);
    }

    if (filters.darts !== 'unset') {
        query = query.eq('dart_board', filters.darts);
    }

    if (filters.pool !== 'unset') {
        query = query.eq('pool_table', filters.pool);
    }

    if (filters.sundayRoast !== 'unset') {
        // TODO:
        console.warn('No sunday roast filter yet');
    }

    if (filters.garden !== 'unset') {
        query = query.eq('beer_garden', filters.garden);
    }

    if (filters.kidFriendly !== 'unset') {
        query = query.eq('kid_friendly', filters.kidFriendly);
    }

    if (filters.liveMusic !== 'unset') {
        query = query.eq('live_music', filters.liveMusic);
    }

    if (filters.boardGames !== 'unset') {
        // TODO:
        console.warn('No board games filter yet');
    }

    if (filters.freeWifi !== 'unset') {
        query = query.eq('free_wifi', filters.freeWifi);
    }

    if (filters.roof !== 'unset') {
        query = query.eq('rooftop', filters.roof);
    }

    if (filters.foosball !== 'unset') {
        query = query.eq('foosball_table', filters.foosball);
    }

    return query;
};

export const fromNowString = (dateString: string) => {
    return dayjs(dateString).fromNow();
};

export const checkIfOpen = (
    openingHours: OpeningHoursType[],
): { isOpen: boolean; nextHours: dayjs.Dayjs } => {
    let nextOpeningHours: dayjs.Dayjs | null = null;

    for (let i = 0; i < openingHours.length; i++) {
        const oh = openingHours[i];

        // As some opening hours are '100' for 1am, convert to '0100'
        let openInput = '';
        let closeInput = '';

        for (let j = 0; j < 4 - oh.open_hour.length; j++) {
            openInput += '0';
        }

        for (let j = 0; j < 4 - oh.close_hour.length; j++) {
            closeInput += '0';
        }

        openInput += oh.open_hour;
        closeInput += oh.close_hour;

        let open = dayjs()
            .day(oh.open_day)
            .hour(parseInt(openInput.substring(0, 2), 10))
            .minute(parseInt(openInput.substring(2), 10));

        let close = dayjs()
            .day(oh.close_day)
            .hour(parseInt(closeInput.substring(0, 2), 10))
            .minute(parseInt(closeInput.substring(2), 10));

        // If today is saturday or sunday, need to manipulate dates to allow for more intuitive checking
        if (dayjs().day() === 6 && open.day() === 6 && close.day() === 0) {
            close = close.add(1, 'w');
        } else if (
            dayjs().day() === 0 &&
            open.day() === 6 &&
            close.day() === 0
        ) {
            open = open.subtract(1, 'w');
        }

        if (dayjs().isAfter(open) && dayjs().isBefore(close)) {
            return { isOpen: true, nextHours: close };
        }

        // If today's Saturday, we'll need to push everything ahead by a week for accurate checking.
        if (dayjs().day() === 6) {
            open = open.add(1, 'w');
        }

        // If we haven't set nextOpeningHours
        // OR the time between nextOpeningHours and now is sooner than currently saved
        // AND this time difference is not negative (i.e. in the past)
        if (
            !nextOpeningHours ||
            (open.unix() - dayjs().unix() <
                nextOpeningHours.unix() - dayjs().unix() &&
                open.unix() - dayjs().unix() > 0)
        ) {
            console.log('OPEN', nextOpeningHours);
            nextOpeningHours = open;
        }
    }

    // @ts-ignore
    return { isOpen: false, nextHours: nextOpeningHours };
};

export const convertFormattedPubsToPubSchema = (
    input: Database['public']['Views']['formatted_pubs']['Row'],
): Database['public']['Tables']['pub_schema']['Row'] => {
    return {
        ...input,
        address: input.address || '',
        description: input.description || '',
        dist_meters: 0, // TODO: calculate distance
        google_id: input.google_id || '',
        id: input.id || 0,
        location: input.location || '',
        name: input.name || '',
        num_reviews: input.num_reviews || 0,
        opening_hours: input.opening_hours || '',
        phone_number: input.phone_number || '',
        photos: input.photos || [],
        rating: input.rating || 0,
        review_beer_amount: input.review_beer_amount || 0,
        review_food_amount: input.review_food_amount || 0,
        review_location_amount: input.review_location_amount || 0,
        review_music_amount: input.review_music_amount || 0,
        review_negative_beer_amount: input.negative_review_beer_amount || 0,
        review_negative_food_amount: input.negative_review_food_amount || 0,
        review_negative_location_amount:
            input.negative_review_location_amount || 0,
        review_negative_music_amount: input.negative_review_music_amount || 0,
        review_negative_service_amount:
            input.negative_review_service_amount || 0,
        review_negative_vibe_amount: input.negative_review_vibe_amount || 0,
        review_service_amount: input.review_service_amount || 0,
        review_tens: input.review_tens || 0,
        review_nines: input.review_nines || 0,
        review_eights: input.review_eights || 0,
        review_sevens: input.review_sevens || 0,
        review_sixes: input.review_sixes || 0,
        review_fives: input.review_fives || 0,
        review_fours: input.review_fours || 0,
        review_threes: input.review_threes || 0,
        review_twos: input.review_twos || 0,
        review_ones: input.review_ones || 0,
        review_vibe_amount: input.review_vibe_amount || 0,
        saved: input.saved || false,
        website: input.website || '',
    };
};
