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

export type UserCommentType = NonNullableFields<tempUCT>;

export type UserReviewType = Omit<
    Database['public']['Views']['user_reviews']['Row'],
    | 'id'
    | 'created_at'
    | 'editors_review'
    | 'is_helpfuls'
    | 'total_helpfuls'
    | 'updated_at'
    | 'user_id'
    | 'user_name'
    | 'pub_id'
    | 'rating'
> & {
    id: number;
    created_at: string;
    editors_review: boolean;
    is_helpfuls: number;
    total_helpfuls: number;
    updated_at: string;
    user_id: string;
    pub_id: number;
    user_name: string;
    rating: number;
};

export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;
