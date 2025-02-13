import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { PRIMARY_COLOR } from '@/constants';
import CollectionList from '@/components/Collections/CollectionList';
import Header from '@/components/Utility/Header';
import { SavedNavigatorScreenProps } from '@/types/nav';
import {
    collectionQuery,
    CollectionType,
} from '@/services/queries/collections';
import { supabase } from '@/services/supabase';
import * as Location from 'expo-location';
import { distance, point } from '@turf/turf';
import { useActionSheet } from '@expo/react-native-action-sheet';

export default function CollectionView({
    navigation,
    route,
}: SavedNavigatorScreenProps<'CollectionView'>) {
    const [collection, setCollection] = useState<CollectionType>();
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState('');

    const { showActionSheetWithOptions } = useActionSheet();

    const isOwnedCollection = useMemo<boolean>(
        () => userId === collection?.user_id,
        [userId, collection],
    );

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

            console.log('TEST', JSON.stringify(data));

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

    const deleteCollection = useCallback(async () => {
        if (!collection) {
            return;
        }

        const { error } = await supabase
            .from('collections')
            .delete()
            .eq('id', collection.id);

        if (error) {
            console.error(error);
            return;
        }

        navigation.navigate('Home', {
            screen: 'Favourites',
            params: { screen: 'CollectionsHome' },
        });
    }, [collection, navigation]);

    const showActions = useCallback(() => {
        if (isOwnedCollection) {
            showActionSheetWithOptions(
                {
                    options: ['Edit', 'Delete', 'Cancel'],
                    cancelButtonIndex: 2,
                    tintColor: '#000',
                },
                selected => {
                    if (selected === 0) {
                        navigation.navigate('EditCollection', {
                            collection,
                        });
                    } else if (selected === 1) {
                        deleteCollection();
                    }
                },
            );

            return;
        }

        showActionSheetWithOptions(
            {
                options: ['Report', 'Cancel'],
                cancelButtonIndex: 1,
                tintColor: '#000',
            },
            selected => {
                if (selected === 0) {
                    // TODO: Add report.
                    console.log('REPORT');
                }
            },
        );
    }, [
        isOwnedCollection,
        navigation,
        showActionSheetWithOptions,
        collection,
        deleteCollection,
    ]);

    return (
        <SafeAreaView style={styles.container}>
            <Header
                header="List"
                leftColumn={
                    <TouchableOpacity
                        style={styles.settingsContainer}
                        onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-outline" size={14} />
                    </TouchableOpacity>
                }
                rightColumn={
                    <TouchableOpacity
                        style={styles.menuContainer}
                        onPress={showActions}>
                        <SimpleLineIcons
                            name="options"
                            color={PRIMARY_COLOR}
                            size={14}
                        />
                    </TouchableOpacity>
                }
            />

            <CollectionList
                collection={collection}
                isLoading={isLoading}
                userId={userId}
                toggleSave={toggleSave}
                setFollow={setFollow}
                setLiked={setLiked}
            />
        </SafeAreaView>
    );
}

const ICON_PADDING = 10;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    settingsContainer: {
        paddingLeft: ICON_PADDING,
    },
    menuContainer: {
        paddingRight: ICON_PADDING,
    },
    listHeaderContainer: {
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userNameText: {
        marginLeft: 5,
        fontWeight: '300',
        fontSize: 14,
    },
    collectionNameText: {
        fontSize: 18,
        fontWeight: '500',
        fontFamily: 'Jost',
        marginTop: 10,
    },
    descriptionText: {
        fontSize: 14,
        fontWeight: '300',
        marginTop: 20,
    },
    topListHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    followContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    followText: {
        marginLeft: 4,
        color: PRIMARY_COLOR,
        fontWeight: '500',
    },
    privacyContainer: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    privacyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 3,
    },
    privacyItemText: {
        fontSize: 12,
        fontWeight: '300',
        letterSpacing: -0.4,
        marginLeft: 2,
    },
});
