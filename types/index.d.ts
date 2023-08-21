import { Database } from './schema';

export type OpeningHoursObject = {
    day: number;
    time: string;
};

export type PubSchema = Database['public']['Tables']['pub_schema']['Row'];

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

type NonNullableFields<T> = {
    [P in keyof T]: NonNullable<T[P]>;
};

type tempURT = Database['public']['Views']['user_reviews']['Row'];
type tempUCT = Database['public']['Views']['user_comments']['Row'];

export type UserReviewType = NonNullableFields<tempURT>;
export type UserCommentType = NonNullableFields<tempUCT>;
