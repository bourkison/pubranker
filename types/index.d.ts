import { Database } from './schema';

export type OpeningHoursObject = {
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
    google_rating: number;
    google_ratings_amount: number;
    google_id: string;
    reservable: boolean;
    website: string;
    dist_meters: number;
    photos: string[];
};

export type NearbyPub =
    Database['public']['Functions']['nearby_pubs']['Returns'][number];
export type DiscoveredPub =
    Database['public']['Functions']['pubs_in_polygon']['Returns'][number];
export type SavedPub =
    Database['public']['Functions']['saved_pubs']['Returns'][number];

export type OpeningHoursType =
    Database['public']['Tables']['opening_hours']['Row'];

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
    code?: string;
};

export type UserType = Database['public']['Tables']['users_public']['Row'];
