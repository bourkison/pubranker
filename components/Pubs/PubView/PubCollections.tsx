import CollectionListItem from '@/components/Collections/CollectionListItem';
import { useSharedPubViewContext } from '@/context/pubViewContext';
import { supabase } from '@/services/supabase';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

type PubCollectionsProps = {
    pubId: number;
};

const INITIAL_AMOUNT = 5;

export default function PubCollections({ pubId }: PubCollectionsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();

    const {
        collections,
        setCollections,
        hasLoadedCollections,
        setHasLoadedCollections,
    } = useSharedPubViewContext();

    useEffect(() => {
        const fetchCollections = async () => {
            setIsLoading(true);

            // First pull all collections with this pub in it.
            // We pull from collections and not collection_items so we
            // Can eventually order on like amount etc.
            const { data: initialData, error: initialError } = await supabase
                .from('collections')
                .select(
                    `
                    id,
                    collection_items!inner(
                        pub:pubs!inner(
                            id
                        )
                    )    
                `,
                )
                .eq('collection_items.pub.id', pubId)
                .limit(INITIAL_AMOUNT);

            if (initialError) {
                console.error('Error on initial pull', initialError);
                setIsLoading(false);
                return;
            }

            const collectionIds = initialData.map(d => d.id);

            // Next pull collection data.
            const { data, error } = await supabase
                .from('collections')
                .select(
                    `
                    id,
                    name,
                    description,
                    public,
                    collaborative,
                    ranked,
                    collection_items!inner(
                        order,
                        pub:pubs(
                            id,
                            primary_photo
                        )
                    ),
                    pubs_count:pubs(count),    
                    user:users_public!collections_user_id_fkey1(
                        id, 
                        name, 
                        username, 
                        profile_photo
                    )
                `,
                )
                .in('id', collectionIds);

            if (error) {
                console.error(error);
                setIsLoading(false);
                return;
            }

            setCollections(data);
            setIsLoading(false);
            setHasLoadedCollections(true);
        };

        if (!hasLoadedCollections && !isLoading) {
            fetchCollections();
        }
    }, [
        hasLoadedCollections,
        setHasLoadedCollections,
        isLoading,
        setCollections,
        collections,
        pubId,
    ]);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    return (
        <View>
            {collections.map(collection => (
                <CollectionListItem
                    key={collection.id}
                    collection={collection}
                    onPress={() =>
                        navigation.navigate('UserCollectionView', {
                            collectionId: collection.id,
                        })
                    }
                />
            ))}
        </View>
    );
}
