import { OpeningHoursType, PubFilters } from '@/types';
import { Database } from '@/types/schema';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
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
        Database['public']['Functions']['get_pubs_with_distances']['Returns'][number],
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

    if (filters.dogFriendly !== null) {
        query = query.eq('dog_friendly', filters.dogFriendly);
    }

    if (filters.liveSport !== null) {
        query = query.eq('live_sport', filters.liveSport);
    }

    if (filters.darts !== null) {
        query = query.eq('dart_board', filters.darts);
    }

    if (filters.poolTable !== null) {
        query = query.eq('pool_table', filters.poolTable);
    }

    if (filters.garden !== null) {
        query = query.eq('beer_garden', filters.garden);
    }

    if (filters.kidFriendly !== null) {
        query = query.eq('kid_friendly', filters.kidFriendly);
    }

    if (filters.liveMusic !== null) {
        query = query.eq('live_music', filters.liveMusic);
    }

    if (filters.boardGames !== null) {
        // TODO:
        console.warn('No board games filter yet');
    }

    if (filters.freeWifi !== null) {
        query = query.eq('free_wifi', filters.freeWifi);
    }

    if (filters.rooftop !== null) {
        query = query.eq('rooftop', filters.rooftop);
    }

    if (filters.foosball !== null) {
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
