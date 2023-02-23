type OpeningHoursObject = {
    day: number;
    time: string;
};

export type PubType = {
    id: number;
    name: string;
    address: string;
    location: { lng: number; lat: number };
    opening_hours: { open: OpeningHoursObject; close: OpeningHoursObject }[];
    phone_number: string;
    google_overview: string;
    google_photos: string[];
    google_rating: number;
    google_ratings_amount: number;
    google_id: string;
    reservable: boolean;
    website: string;
    dist_meters: number;
    photos: string[];
};

export type BoundingBox = {
    minLat: number;
    minLong: number;
    maxLat: number;
    maxLong: number;
};

export type BoolOrUnset = boolean | 'unset';

export type PubFilters = {
    dogFriendly: BoolOrUnset;
    liveSport: BoolOrUnset;
    darts: BoolOrUnset;
    pool: BoolOrUnset;
    sundayRoast: BoolOrUnset;
    garden: BoolOrUnset;
    kidFriendly: BoolOrUnset;
    liveMusic: BoolOrUnset;
    boardGames: BoolOrUnset;
    freeWifi: BoolOrUnset;
    roof: BoolOrUnset;
    foosball: BoolOrUnset;
    wheelchairAccessible: BoolOrUnset;
};

export type RejectWithValueType = {
    message?: string;
    code?: number;
};
