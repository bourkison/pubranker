import { supabase } from '@/services/supabase';
import { Tables } from '@/types/schema';

export type UserType = Tables<'users_public'> & {
    total_reviews: { count: number }[];
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
total_reviews:reviews(count),
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

export const userQuery = () =>
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
        .eq('review_tens.rating', 10);
