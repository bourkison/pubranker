import { BoundingBox, PubFilters, PubType } from '@/types';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

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

export const forcePubType = (input: any, photos: any): PubType => {
    const convertPhotos = (p: any[]): string[] => {
        return p.map(photo => photo.key);
    };

    // TODO: Add checking
    return {
        id: input.id,
        name: input.name,
        address: input.address || '',
        location: !input.latitude
            ? convertPointStringToObject(input.location)
            : { lat: input.latitude, lng: input.longitude },
        opening_hours: input.opening_hours || [],
        phone_number: input.phone_number || '',
        google_overview: input.google_overview || '',
        google_photos: input.google_photos || [],
        google_rating: input.google_rating || -1,
        google_ratings_amount: input.google_ratings_amount || -1,
        google_id: input.google_id || '',
        reservable: input.reservable || false,
        website: input.website || '',
        dist_meters: input.dist_meters || -1,
        photos: convertPhotos(photos) || [],
    };
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

type Coordinates = { x: number; y: number };
type BoundingBoxCoordinates = {
    topLeft: Coordinates;
    topRight: Coordinates;
    bottomLeft: Coordinates;
    bottomRight: Coordinates;
};

const convertBoxToCoordinates = (
    input: BoundingBox,
): BoundingBoxCoordinates => ({
    topLeft: { x: input.minLat, y: input.maxLong },
    topRight: { x: input.maxLat, y: input.maxLong },
    bottomLeft: { x: input.minLat, y: input.minLong },
    bottomRight: { x: input.maxLat, y: input.minLong },
});

export const hasFetchedPreviously = (
    toFetch: BoundingBox,
    previouslyFetched: BoundingBox[],
): boolean => {
    const toFetchCoords = convertBoxToCoordinates(toFetch);

    for (let i = 0; i < previouslyFetched.length; i++) {
        const toCheck = convertBoxToCoordinates(previouslyFetched[i]);

        if (
            toFetchCoords.topLeft.x < toCheck.topLeft.x ||
            toFetchCoords.topLeft.y > toCheck.topLeft.y
        ) {
            continue;
        }

        if (
            toFetchCoords.topRight.x > toCheck.topRight.x ||
            toFetchCoords.topRight.y > toCheck.topRight.y
        ) {
            continue;
        }

        if (
            toFetchCoords.bottomLeft.x < toCheck.bottomLeft.x ||
            toFetchCoords.bottomLeft.y < toCheck.bottomLeft.y
        ) {
            continue;
        }

        if (
            toFetchCoords.bottomRight.x > toCheck.bottomRight.x ||
            toFetchCoords.bottomRight.y < toCheck.bottomRight.y
        ) {
            continue;
        }

        console.log('PREVIOusLY CHECKED.');
        return true;
    }

    return false;
};
