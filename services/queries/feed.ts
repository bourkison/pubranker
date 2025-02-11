import { supabase } from '@/services/supabase';
import { Tables } from '@/types/schema';

export type FeedType = {
    id: number;
    created_at: string;
    type: Tables<'feed'>['type'];
    users: {
        id: string;
        followers: {
            id: number;
            created_by: string;
        }[];
    };
    review_likes: Tables<'review_likes'> | null;
    reviews: Tables<'reviews'> | null;
};

const getFeedQueryString = `
id,
created_at,
type,
users:users_public!inner(
    id,
    followers:follows!follows_user_id_fkey!inner(
        id,
        created_by
    )
),
reviews(*),
review_likes(*)
` as const;

export const getFeedQuery = (userId: string) =>
    supabase
        .from('feed')
        .select(getFeedQueryString)
        .eq('users.followers.created_by', userId);
