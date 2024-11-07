import { PubItemType } from '@/components/Pubs/PubItem';
import { supabase } from '../supabase';

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
        profile_photo: string | null;
    };
};

export const listFollowedCollectionsQueryString = `
id,
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
    user:users_public(id, name, profile_photo)
)
` as const;

export const listFollowedCollectionsQuery = () =>
    supabase
        .from('collection_follows')
        .select(listFollowedCollectionsQueryString);

// --------------------------------

export type CollectionType = {
    id: number;
    name: string;
    description: string | null;
    pubs: PubItemType[];
    user: {
        id: string;
        name: string;
        profile_photo: string | null;
    };
    is_followed: { count: number }[];
};

const collectionQueryString = `
id,
name,
description,
collection_items(pub_id, created_at),
user:users_public(id, name, profile_photo),
is_followed:collection_follows(count)
` as const;

export const collectionQuery = () =>
    supabase.from('collections').select(collectionQueryString);
