import { Tables } from '@/types/schema';
import { supabase } from '@/services/supabase';

export type FollowsType = Tables<'follows'> & {
    user: Tables<'users_public'> & {
        is_followed: { count: number }[];
    };
};

const getFollowersQueryString = `
*,
user:users_public!follows_created_by_fkey(
    *,
    is_followed:follows!follows_user_id_fkey(count)
)
` as const;

export const getFollowersQuery = (userId: string, loggedInUserId?: string) =>
    supabase
        .from('follows')
        .select(getFollowersQueryString)
        .eq('user_id', userId)
        .eq('user.is_followed.created_by', loggedInUserId || '');

// --------------------------------

const getFollowingQueryString = `
*,
user:users_public!follows_user_id_fkey(
    *,
    is_followed:follows!follows_user_id_fkey(count)
)
` as const;

export const getFollowingQuery = (userId: string, loggedInUserId?: string) =>
    supabase
        .from('follows')
        .select(getFollowingQueryString)
        .eq('created_by', userId)
        .eq('users_public.is_followed.created_by', loggedInUserId || '');
