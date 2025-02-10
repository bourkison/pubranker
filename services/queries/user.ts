import { supabase } from '@/services/supabase';
import { Tables } from '@/types/schema';

export type UserType = Tables<'users_public'> & {
    reviews: { count: number }[];
    ratings: { count: number }[];
    recent_ratings: {
        id: number;
        created_at: string;
        updated_at: string;
        rating: number;
        pubs: {
            id: number;
            primary_photo: string | null;
            name: string;
        };
    }[];
    followers: { count: number }[];
    following: { count: number }[];
    collections: { count: number }[];
    review_ones: { count: number }[];
    review_twos: { count: number }[];
    review_threes: { count: number }[];
    review_fours: { count: number }[];
    review_fives: { count: number }[];
    review_sixes: { count: number }[];
    review_sevens: { count: number }[];
    review_eights: { count: number }[];
    review_nines: { count: number }[];
    review_tens: { count: number }[];
};

const userQueryString = `*,
reviews(count),
ratings:reviews(count),
recent_ratings:reviews(
    id,
    created_at,
    updated_at,
    rating,
    pubs(
        id,
        primary_photo,
        name
    )
),
followers:follows!follows_user_id_fkey(count),
following:follows!follows_created_by_fkey(count),
collections:collection_follows!collection_follows_user_id_fkey(count),
review_ones:reviews(count),
review_twos:reviews(count),
review_threes:reviews(count),
review_fours:reviews(count),
review_fives:reviews(count),
review_sixes:reviews(count),
review_sevens:reviews(count),
review_eights:reviews(count),
review_nines:reviews(count),
review_tens:reviews(count)
` as const;

export const userQuery = (userId: string) =>
    supabase
        .from('users_public')
        .select(userQueryString)
        .eq('review_ones.rating', 1)
        .eq('review_twos.rating', 2)
        .eq('review_threes.rating', 3)
        .eq('review_fours.rating', 4)
        .eq('review_fives.rating', 5)
        .eq('review_sixes.rating', 6)
        .eq('review_sevens.rating', 7)
        .eq('review_eights.rating', 8)
        .eq('review_nines.rating', 9)
        .eq('review_tens.rating', 10)
        .eq('following.created_by', userId)
        .eq('followers.user_id', userId)
        .neq('reviews.content', null)
        .neq('reviews.content', '')
        .eq('id', userId)
        .order('updated_at', {
            referencedTable: 'recent_ratings',
            ascending: true,
        })
        .limit(3, { referencedTable: 'recent_ratings' })
        .limit(1)
        .single();
