import { BoundingBox, PubFilters, PubType } from '@/types';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import * as turf from '@turf/turf';
// @ts-ignore
import de9im from 'de9im';

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

export const convertBoxToCoordinates = (input: BoundingBox): number[][] => [
    [input.minLong, input.maxLat],
    [input.maxLong, input.maxLat],
    [input.maxLong, input.minLat],
    [input.minLong, input.minLat],
    [input.minLong, input.maxLat],
];

export const convertCoordsToMultiPolygon = (polygonArr: number[][][][]) => {
    return turf
        .multiPolygon(polygonArr[0].map(polygon => [polygon]))
        .geometry.coordinates.map(t =>
            t[0].map(c => ({ latitude: c[1], longitude: c[0] })),
        );
};

// TODO: Alot of improvements can be made on this function.
// i.e. should break up request to only get regions I haven't searched yet.
// (i.e. of 50% of screen) has been searched, only request the other 50%.
export const hasFetchedPreviously = (
    toFetch: BoundingBox,
    previouslyFetched: BoundingBox[],
): boolean => {
    let response = false;

    if (previouslyFetched.length > 0) {
        const toFetchPolygon = turf.polygon([convertBoxToCoordinates(toFetch)]);
        const previouslyFetchedMultiPolygon = turf.multiPolygon([
            previouslyFetched.map(c => convertBoxToCoordinates(c)),
        ]);

        response = !de9im.within(previouslyFetchedMultiPolygon, toFetchPolygon);
        console.log('HAS FETCHED:', response);
    }

    return true;
};

export const joinPolygons = (
    newPolygon: turf.helpers.Feature<
        turf.helpers.MultiPolygon | turf.helpers.Polygon
    >,
    originalPolygon: turf.helpers.Feature<
        turf.helpers.MultiPolygon | turf.helpers.Polygon
    > | null,
): turf.helpers.Feature<turf.helpers.MultiPolygon | turf.helpers.Polygon> => {
    if (!originalPolygon) {
        return newPolygon;
    }

    const response = turf.union(newPolygon, originalPolygon);

    if (!response) {
        console.warn('Error in polygon uniuon');
        return originalPolygon;
    }

    return response;
};
