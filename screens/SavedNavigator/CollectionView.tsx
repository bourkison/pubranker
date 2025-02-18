import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { HEADER_ICON_SIZE, PRIMARY_COLOR } from '@/constants';
import CollectionList from '@/components/Collections/CollectionList';
import Header from '@/components/Utility/Header';
import { SavedNavigatorScreenProps } from '@/types/nav';
import {
    collectionQuery,
    CollectionType,
} from '@/services/queries/collections';
import { supabase } from '@/services/supabase';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { FetchPubType, pubQuery } from '@/services/queries/pub';

type ActionSheetOptions =
    | 'Edit'
    | 'Add Pub'
    | 'Add Comment'
    | 'Delete'
    | 'Cancel'
    | 'Report'
    | 'Add Collaborator';

export default function CollectionView({
    navigation,
    route,
}: SavedNavigatorScreenProps<'CollectionView'>) {
    const [collection, setCollection] = useState<CollectionType>();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [userId, setUserId] = useState('');

    const { showActionSheetWithOptions } = useActionSheet();

    const isOwnedCollection = useMemo<boolean>(
        () => userId === collection?.user_id,
        [userId, collection],
    );

    const isCollaborator = useMemo<boolean>(() => {
        if (!collection) {
            return false;
        }

        if (isOwnedCollection) {
            return true;
        }

        if (collection.collaborators.map(c => c.user.id).includes(userId)) {
            return true;
        }

        return false;
    }, [isOwnedCollection, collection, userId]);

    const menuActionSheetOptions = useMemo<ActionSheetOptions[]>(() => {
        if (!collection) {
            return [];
        }

        if (isOwnedCollection) {
            if (collection.collaborative) {
                return [
                    'Add Collaborator',
                    'Add Pub',
                    'Add Comment',
                    'Edit',
                    'Delete',
                    'Cancel',
                ];
            }

            return ['Add Pub', 'Add Comment', 'Edit', 'Delete', 'Cancel'];
        }

        if (isCollaborator) {
            return [
                'Add Collaborator',
                'Add Comment',
                'Add Pub',
                'Delete',
                'Cancel',
            ];
        }

        return ['Report', 'Add Comment', 'Cancel'];
    }, [collection, isOwnedCollection, isCollaborator]);

    const loadData = useCallback(
        async (setLoading: Dispatch<SetStateAction<boolean>>) => {
            setLoading(true);

            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                console.error(userError);
                setLoading(false);
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
                setLoading(false);
                return;
            }

            // @ts-ignore
            let coll: CollectionType = data as CollectionType;

            setCollection(coll);
            setLoading(false);
        },
        [route],
    );

    useEffect(() => {
        loadData(setIsLoading);
    }, [loadData]);

    const refresh = useCallback(() => loadData(setIsRefreshing), [loadData]);

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
                setCollection({
                    ...collection,
                    collection_items: collectionItems,
                });
            }
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

    const addCollaborator = useCallback(
        async (user: {
            id: string;
            username: string;
            profile_photo: string | null;
        }) => {
            if (!collection) {
                return;
            }

            const { error } = await supabase
                .from('collection_collaborations')
                .insert({
                    collection_id: collection.id,
                    user_id: user.id,
                });

            if (error) {
                console.error(error);
                return;
            }

            setCollection({
                ...collection,
                collaborators: [
                    ...collection.collaborators,
                    {
                        user: {
                            id: user.id,
                            username: user.username,
                            profile_photo: user.profile_photo,
                        },
                    },
                ],
            });
        },
        [collection],
    );

    const addPubToCollection = useCallback(() => {
        if (!collection) {
            return;
        }

        navigation.navigate('SelectPub', {
            header: 'Select a pub',
            onAdd: async pub => {
                const { error: insertError } = await supabase
                    .from('collection_items')
                    .insert({ pub_id: pub.id, collection_id: collection.id });

                if (insertError) {
                    console.error(insertError);
                    return;
                }

                // Get the pub information.
                const { data, error } = await pubQuery(userId)
                    .eq('id', pub.id)
                    .limit(1)
                    .single();

                if (error) {
                    console.error(error);
                    return;
                }

                // Get user username and profile_photo
                // TODO: This could probably just be stored in store
                const { data: userPublicData, error: userPublicError } =
                    await supabase
                        .from('users_public')
                        .select('username, profile_photo')
                        .eq('id', userId)
                        .limit(1)
                        .single();

                if (userPublicError) {
                    console.error(error);
                    return;
                }

                // @ts-ignore
                const response: FetchPubType = data;

                setCollection({
                    ...collection,
                    collection_items: [
                        ...collection.collection_items,
                        {
                            user: {
                                id: userId,
                                username: userPublicData.username,
                                profile_photo: userPublicData.profile_photo,
                            },
                            pub: {
                                address: response.address,
                                id: response.id,
                                location: response.location,
                                name: response.name,
                                num_reviews: response.num_reviews,
                                primary_photo: response.primary_photo,
                                rating: response.rating,
                                saved: response.saved,
                            },
                        },
                    ],
                });
            },
            excludedIds: collection.collection_items.map(pubs => pubs.pub.id),
        });
    }, [collection, navigation, userId]);

    const showActions = useCallback(() => {
        showActionSheetWithOptions(
            {
                options: menuActionSheetOptions,
                cancelButtonIndex: menuActionSheetOptions.length - 1,
                tintColor: '#000',
            },
            selected => {
                if (selected === undefined) {
                    return;
                }

                if (!collection) {
                    return;
                }

                if (menuActionSheetOptions[selected] === 'Edit') {
                    navigation.navigate('EditCollection', {
                        collection,
                    });
                } else if (menuActionSheetOptions[selected] === 'Add Comment') {
                    navigation.navigate('CollectionComments', {
                        collectionId: collection.id,
                        focusOnOpen: true,
                    });
                } else if (menuActionSheetOptions[selected] === 'Add Pub') {
                    addPubToCollection();
                } else if (menuActionSheetOptions[selected] === 'Delete') {
                    deleteCollection();
                } else if (
                    menuActionSheetOptions[selected] === 'Add Collaborator'
                ) {
                    navigation.navigate('AddCollaborator', {
                        excludedIds: [
                            userId,
                            ...collection.collaborators.map(c => c.user.id),
                        ],
                        onAdd: addCollaborator,
                    });
                }
            },
        );
    }, [
        menuActionSheetOptions,
        navigation,
        userId,
        addPubToCollection,
        showActionSheetWithOptions,
        collection,
        deleteCollection,
        addCollaborator,
    ]);

    const removeCollectionItem = useCallback(
        async (id: number) => {
            if (!isCollaborator) {
                return;
            }

            if (!collection) {
                return;
            }

            // Remove locally.
            let temp = collection.collection_items.slice();
            temp = temp.filter(item => item.pub.id !== id);

            setCollection({ ...collection, collection_items: temp });

            // Delete in database.
            const { error } = await supabase
                .from('collection_items')
                .delete()
                .eq('pub_id', id)
                .eq('collection_id', collection.id);

            if (error) {
                console.error(error);
                return;
            }
        },
        [collection, isCollaborator],
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header
                header="List"
                leftColumn={
                    <TouchableOpacity
                        style={styles.settingsContainer}
                        onPress={() => navigation.goBack()}>
                        <Ionicons
                            name="arrow-back-outline"
                            size={HEADER_ICON_SIZE}
                        />
                    </TouchableOpacity>
                }
                rightColumn={
                    <TouchableOpacity
                        style={styles.menuContainer}
                        onPress={showActions}>
                        <SimpleLineIcons
                            name="options"
                            color={PRIMARY_COLOR}
                            size={HEADER_ICON_SIZE}
                        />
                    </TouchableOpacity>
                }
            />

            <CollectionList
                refresh={refresh}
                isRefreshing={isRefreshing}
                collection={collection}
                canEdit={isCollaborator}
                onItemRemove={removeCollectionItem}
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
