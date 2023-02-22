import { PubType } from '@/types';

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

export const forcePubType = (input: any): PubType => {
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
        photos: input.photos || [],
    };
};

export const mapArrResponseToPubType = (input: any): PubType[] => {
    return input.map((i: any) => forcePubType(i));
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
