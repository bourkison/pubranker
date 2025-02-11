import { supabase } from '@/services/supabase';
import { Tables } from '@/types/schema';

export type FeedType = {
    id: number;
    created_at: string;
    type: Tables<'feed'>['type'];
    user: {
        id: string;
        username: string;
        profile_photo: string;
        followers: {
            id: number;
            created_by: string;
        }[];
    };
    review_likes: {
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
};

const getFeedQueryString = `
id,
created_at,
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
review_likes(
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
)
` as const;

export const getFeedQuery = (userId: string) =>
    supabase
        .from('feed')
        .select(getFeedQueryString)
        .eq('user.followers.created_by', userId);
