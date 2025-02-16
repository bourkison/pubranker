import { supabase } from '@/services/supabase';
import { Tables } from '@/types/schema';

export type ListReviewType = Tables<'reviews'> & {
    user: {
        id: string;
        name: string;
        username: string;
        profile_photo: string | null;
    };
    pub: {
        id: number;
        name: string;
        primary_photo: string | null;
    };
    liked: { count: number }[];
    like_amount: { count: number }[];
};

export const reviewListQueryString = `*,
user:users_public(id, name, username, profile_photo),
pub:pubs(id, name, primary_photo),
liked:review_likes(count),
like_amount:review_likes(count)` as const;

export const reviewListQuery = () =>
    supabase.from('reviews').select(reviewListQueryString);

// --------------------

export type ReviewType = Tables<'reviews'> & {
    user: {
        id: string;
        username: string;
        profile_photo: string | null;
    };
    liked: { count: number }[];
    like_amount: { count: number }[];
    pub: {
        id: number;
        name: string;
        address: string;
        primary_photo: string | null;
    };
    comments: (Tables<'comments'> & {
        liked: { count: number }[];
        like_amount: { count: number }[];
        user: { id: string; username: string; profile_photo: string | null };
    })[];
};

export const reviewQueryString = `*,
user:users_public(id, username, profile_photo),
liked:review_likes(count),
like_amount:review_likes(count),
pub:pubs(id, name, address, primary_photo),
comments(
    *,
    liked:comment_likes(count),
    like_amount:comment_likes(count),
    user:users_public(id, username, profile_photo)
)` as const;

export const reviewQuery = () =>
    supabase.from('reviews').select(reviewQueryString);
