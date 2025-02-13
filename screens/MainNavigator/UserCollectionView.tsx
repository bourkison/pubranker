import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import CollectionList from '@/components/Collections/CollectionList';
import { RootStackScreenProps } from '@/types/nav';
import { supabase } from '@/services/supabase';
import {
    collectionQuery,
    CollectionType,
} from '@/services/queries/collections';
import * as Location from 'expo-location';
import { distance, point } from '@turf/turf';

export default function UserCollectionView({
    navigation,
    route,
}: RootStackScreenProps<'UserCollectionView'>) {
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [collection, setCollection] = useState<CollectionType>();

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                console.error(userError);
                setIsLoading(false);
                return;
            }

            setUserId(userData.user.id);

            const { data, error } = await collectionQuery(userData.user.id)
                .eq('id', route.params.collectionId)
                .order('order', {
                    referencedTable: 'collection_items',
                    ascending: true,
                })
                .limit(1)
                .single();

            if (error) {
                console.error(error);
                setIsLoading(false);
                return;
            }

            // @ts-ignore
            let coll: CollectionType = data as CollectionType;

            const { coords } = await Location.getCurrentPositionAsync();

            coll = {
                ...coll,
                collection_items: coll.collection_items.map(
                    collection_item => ({
                        ...collection_item,
                        pub: {
                            ...collection_item.pub,
                            dist_meters: distance(
                                point([coords.longitude, coords.latitude]),
                                point(collection_item.pub.location.coordinates),
                                { units: 'meters' },
                            ),
                        },
                    }),
                ),
            };

            setCollection(coll);
            setIsLoading(false);
        })();
    }, [route]);

    const setFollow = useCallback(
        (follow: boolean) => {
            if (!collection) {
                return;
            }

            if (follow) {
                setCollection({ ...collection, is_followed: [{ count: 1 }] });
                return;
            }

            setCollection({ ...collection, is_followed: [{ count: 0 }] });
        },
        [collection],
    );

    const setLiked = useCallback(
        (like: boolean) => {
            if (!collection) {
                return;
            }

            if (like) {
                setCollection({
                    ...collection,
                    is_liked: [{ count: 1 }],
                    likes: [{ count: collection.likes[0].count + 1 }],
                });
                return;
            }

            setCollection({
                ...collection,
                is_liked: [{ count: 0 }],
                likes: [{ count: collection.likes[0].count - 1 }],
            });
        },
        [collection],
    );

    const toggleSave = useCallback(
        (id: number, isSave: boolean) => {
            if (!collection) {
                return;
            }

            const collectionItems = collection.collection_items.slice();

            const index = collectionItems.findIndex(
                collection_index => collection_index.pub.id === id,
            );

            if (index > -1) {
                collectionItems[index].pub.saved = [{ count: isSave ? 1 : 0 }];
            }

            setCollection({ ...collection, collection_items: collectionItems });
        },
        [collection],
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.settingsContainer}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={14} />
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>List</Text>
                </View>

                <View style={styles.menuContainer} />
            </View>

            <CollectionList
                collection={collection}
                isLoading={isLoading}
                setFollow={setFollow}
                setLiked={setLiked}
                toggleSave={toggleSave}
                userId={userId}
            />
        </SafeAreaView>
    );
}

const ICON_PADDING = 10;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Jost',
        textAlign: 'center',
    },
    settingsContainer: {
        paddingLeft: ICON_PADDING,
    },
    menuContainer: {
        paddingRight: ICON_PADDING,
    },
});
