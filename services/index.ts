import { OpeningHoursType, PubFilters } from '@/types';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import * as turf from '@turf/turf';

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

export const parseOpeningHours = (
    openingHoursString: string,
): OpeningHoursType[] => {
    const oh: OpeningHoursType[] = JSON.parse(openingHoursString);
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

export const roundToNearest = (input: number, nearest: number) => {
    return Math.ceil(input / nearest) * nearest;
};

export const distanceString = (input: number) => {
    // TODO: Miles vs Metric.

    const amount = roundToNearest(input, 10);

    if (amount >= 1000) {
        return `${roundToNearest(amount, 100) / 1000}km away`;
    } else {
        return `${amount}m away`;
    }
};

export const applyFilters = (
    query: PostgrestFilterBuilder<any, any, any>,
    filters: PubFilters,
    searchText: string,
): PostgrestFilterBuilder<any, any, any> => {
    if (searchText) {
        query = query.textSearch('name', `'${searchText}'`);
    }

    if (filters.dogFriendly !== 'unset') {
        query = query.eq('dog_friendly', filters.dogFriendly);
    }

    if (filters.liveSport !== 'unset') {
        query = query.eq('live_sport', filters.liveSport);
    }

    if (filters.darts !== 'unset') {
        if (filters.darts === true) {
            query = query.gt('dart_board_amount', 0);
        } else {
            query = query.eq('dart_board_amount', 0);
        }
    }

    if (filters.pool !== 'unset') {
        if (filters.pool === true) {
            query = query.gt('pool_table_amount', 0);
        } else {
            query = query.eq('pool_table_amount', 0);
        }
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
        query = query.eq('live_music', filters.freeWifi);
    }

    if (filters.roof !== 'unset') {
        query = query.eq('rooftop', filters.roof);
    }

    if (filters.foosball !== 'unset') {
        if (filters.foosball === true) {
            query = query.gt('foosball_table_amount', 0);
        } else {
            query = query.eq('foosball_table_amount', 0);
        }
    }

    return query;
};
