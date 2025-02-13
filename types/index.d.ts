import { Database } from './schema';

export type OpeningHoursObject = {
    day: number;
    time: string;
};

export type OpeningHoursType =
    Database['public']['Tables']['opening_hours']['Row'];

export type BoundingBox = {
    minLat: number;
    minLong: number;
    maxLat: number;
    maxLong: number;
};

export type PubFilters = {
    reservable: boolean | null;
    dogFriendly: boolean | null;
    liveSport: boolean | null;
    darts: boolean | null;
    poolTable: boolean | null;
    sundayRoast: boolean | null;
    garden: boolean | null;
    kidFriendly: boolean | null;
    liveMusic: boolean | null;
    boardGames: boolean | null;
    freeWifi: boolean | null;
    rooftop: boolean | null;
    foosball: boolean | null;
    wheelchairAccessible: boolean | null;
};

export type RejectWithValueType = {
    message?: string;
    code?: string;
};

type NonNullableFields<T> = {
    [P in keyof T]: NonNullable<T[P]>;
};

export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;
