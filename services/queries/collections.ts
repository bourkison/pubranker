import { supabase } from '../supabase';
import { Tables } from '@/types/schema';

export type ListCollectionType = {
    id: number;
    name: string;
    description: string | null;
    pubs: {
        id: number;
        primary_photo: string | null;
    }[];
    pubs_count: {
        count: number;
    }[];
    user: {
        id: string;
        name: string;
        username: string;
        profile_photo: string | null;
    };
};

export const listFollowedCollectionsQueryString = `
created_at,
updated_at,
collections(
    id,
    name,
    description,
    pubs(
        id,
        primary_photo
    ),
    pubs_count:pubs(count),
    user:users_public!collections_user_id_fkey1(id, name, username, profile_photo)
)
` as const;

export const listFollowedCollectionsQuery = () =>
    supabase
        .from('collection_follows')
        .select(listFollowedCollectionsQueryString);

// --------------------------------

export type CollectionType = Tables<'collections'> & {
    collection_items: {
        pub: {
            id: number;
            name: string;
            address: string;
            primary_photo: string;
            location: {
                coordinates: [number, number];
                type: string;
            };
            saved: { count: number }[];
            rating: number;
            num_reviews: { count: number }[];
            dist_meters: number;
        };
    }[];
    user: {
        id: string;
        name: string;
        username: string;
        profile_photo: string;
    };
    is_followed: { count: number }[];
    is_liked: { count: number }[];
    likes: { count: number }[];
};

const collectionQueryString = `
*,
collection_items(
    created_at,
    order,
    pub:pubs(
        id, 
        name, 
        address,
        num_reviews:reviews(count),
        primary_photo, 
        saved:saves(count),
        location:get_pub_location, 
        rating:get_pub_rating
    )
),
user:users_public!collections_user_id_fkey1(id, name, username, profile_photo),
is_followed:collection_follows(count),
is_liked:collection_likes(count),
likes:collection_likes(count)
` as const;

export const collectionQuery = (userId: string) =>
    supabase
        .from('collections')
        .select(collectionQueryString)
        .eq('is_followed.user_id', userId)
        .eq('is_liked.user_id', userId)
        .eq('collection_items.pub.saved.user_id', userId);
