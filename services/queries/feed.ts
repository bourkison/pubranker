import { supabase } from '@/services/supabase';
import { Tables } from '@/types/schema';

export type FeedType = {
    id: number;
    created_at: string;
    updated_at: string;
    type: Tables<'feed'>['type'];
    user: {
        id: string;
        username: string;
        profile_photo: string;
    };
    review_like: {
        id: number;
        review: {
            id: number;
            user: {
                id: string;
                username: string;
                profile_photo: string;
            };
            pub: {
                id: number;
                name: string;
                primary_photo: string;
            };
        };
    } | null;
    review: {
        id: number;
        content: string | null;
        rating: number;
        pub: {
            id: number;
            name: string;
            primary_photo: string;
        };
    } | null;
    follow: {
        id: number;
        user: {
            id: string;
            username: string;
            profile_photo: string;
        };
    } | null;
};

const getFeedQueryString = `
id,
created_at,
updated_at,
type,
user:users_public!inner(
    id,
    username,
    profile_photo,
    followers:follows!follows_user_id_fkey!inner(
        id,
        created_by
    )
),
review:reviews(
    id,
    rating,
    content,
    pub:pubs(
        id,
        name,
        primary_photo
    )
),
review_like:review_likes(
    id,
    review:reviews(
        id,
        user:users_public(
            id,
            username,
            profile_photo
        ),
        pub:pubs(
            id,
            name,
            primary_photo
        )
    )
),
follow:follows(
    id,
    user:users_public!follows_user_id_fkey(
        id,
        username,
        profile_photo
    )
)
` as const;

export const getFeedQuery = (userId: string) =>
    supabase
        .from('feed')
        .select(getFeedQueryString)
        .eq('user.followers.created_by', userId);

// ---------------------------------------------------

const getUserFeedQueryString = `
id,
created_at,
updated_at,
type,
user:users_public!inner(
    id,
    username,
    profile_photo
),
review:reviews(
    id,
    rating,
    content,
    pub:pubs(
        id,
        name,
        primary_photo
    )
),
review_like:review_likes(
    id,
    review:reviews(
        id,
        user:users_public(
            id,
            username,
            profile_photo
        ),
        pub:pubs(
            id,
            name,
            primary_photo
        )
    )
),
follow:follows(
    id,
    user:users_public!follows_user_id_fkey(
        id,
        username,
        profile_photo
    )
)
` as string;

export const getUserFeedQuery = (userId: string) =>
    supabase.from('feed').select(getUserFeedQueryString).eq('user.id', userId);
