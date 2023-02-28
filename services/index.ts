import { OpeningHoursType, PubFilters } from '@/types';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import * as turf from '@turf/turf';
import dayjs from 'dayjs';

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
