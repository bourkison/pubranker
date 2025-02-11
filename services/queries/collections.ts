import { supabase } from '../supabase';
import { Database, Tables } from '@/types/schema';

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
    pubs: Database['public']['Functions']['get_pub_list_item']['Returns'][number][];
    user: {
        id: string;
        name: string;
        username: string;
        profile_photo: string | null;
    };
    is_followed: { count: number }[];
};

const collectionQueryString = `
*,
collection_items(pub_id, created_at),
user:users_public!collections_user_id_fkey1(id, name, username, profile_photo),
is_followed:collection_follows(count)
` as const;

export const collectionQuery = () =>
    supabase.from('collections').select(collectionQueryString);
