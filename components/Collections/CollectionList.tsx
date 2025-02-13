import {
    collectionQuery,
    CollectionType,
} from '@/services/queries/collections';
import { supabase } from '@/services/supabase';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Pressable,
} from 'react-native';
import * as Location from 'expo-location';
import { PRIMARY_COLOR } from '@/constants';
import {
    Ionicons,
    FontAwesome6,
    Entypo,
    MaterialIcons,
} from '@expo/vector-icons';
import CollectionMap from '@/components/Collections/CollectionMap';
import UserAvatar from '@/components/User/UserAvatar';
import SavedListItem from '@/components/Saves/SavedListItem';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { distance, point } from '@turf/turf';
import LikeCollectionButton from '@/components/Collections/LikeCollectionButton';

type CollectionListProps = {
    collectionId: number;
};

export default function CollectionList({ collectionId }: CollectionListProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [collection, setCollection] = useState<CollectionType>();
    const [userId, setUserId] = useState('');

    const navigation =
        useNavigation<StackNavigationProp<MainNavigatorStackParamList>>();

    const followButtonDisabled = useMemo<boolean>(() => {
        if (!collection) {
            return true;
        }

        if (!userId) {
            return true;
        }

        if (userId === collection.user_id) {
            return true;
        }

        if (isFollowing) {
            return true;
        }

        if (isLoading) {
            return true;
        }

        return false;
    }, [collection, userId, isFollowing, isLoading]);

    const liked = useMemo<boolean>(() => {
        if (!collection) {
            return false;
        }

        return collection.is_liked[0].count > 0;
    }, [collection]);

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
                .eq('id', collectionId)
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
    }, [collectionId]);

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
                collectionItems[index].pub.saved[0].count = isSave ? 1 : 0;
            }

            setCollection({ ...collection, collection_items: collectionItems });
        },
        [collection],
    );

    const toggleFollow = useCallback(async () => {
        if (!collection || isFollowing) {
            return;
        }

        setIsFollowing(true);

        const { data, error } = await supabase.auth.getUser();

        if (error) {
            console.error(error);
            setIsFollowing(false);
            return;
        }

        if (collection.is_followed[0].count === 1) {
            // UNFOLLOW.
            if (collection.user_id === data.user.id) {
                console.error('Can not unfollow created collection');
                setIsFollowing(false);
                return;
            }

            const { error: followError } = await supabase
                .from('collection_follows')
                .delete()
                .eq('collection_id', collection.id)
                .eq('user_id', data.user.id);

            if (followError) {
                console.error(followError);
                setIsFollowing(false);
                return;
            }

            setCollection({ ...collection, is_followed: [{ count: 0 }] });
        } else {
            // FOLLOW.
            const { error: followError } = await supabase
                .from('collection_follows')
                .insert({
                    collection_id: collection.id,
                    user_id: data.user.id,
                });

            if (followError) {
                console.error(followError);
                setIsFollowing(false);
                return;
            }

            setCollection({ ...collection, is_followed: [{ count: 1 }] });
        }

        setIsFollowing(false);
    }, [collection, isFollowing]);

    const setToLiked = useCallback(() => {
        if (!collection) {
            return;
        }

        setCollection({
            ...collection,
            is_liked: [{ count: 1 }],
            likes: [{ count: collection.likes[0].count + 1 }],
        });
    }, [collection]);

    const setToUnliked = useCallback(() => {
        if (!collection) {
            return;
        }

        setCollection({
            ...collection,
            is_liked: [{ count: 0 }],
            likes: [{ count: collection.likes[0].count - 1 }],
        });
    }, [collection]);

    return (
        <FlatList
            data={collection?.collection_items || []}
            keyExtractor={item => item.pub.id.toString()}
            ListEmptyComponent={
                isLoading ? (
                    <ActivityIndicator />
                ) : (
                    <View>
                        <Text>No pubs added to this collection yet</Text>
                    </View>
                )
            }
            ListHeaderComponent={
                collection && (
                    <>
                        {collection.collection_items.length && (
                            <CollectionMap
                                collectionItems={collection.collection_items}
                            />
                        )}
                        <View style={styles.listHeaderContainer}>
                            <View style={styles.topListHeaderContainer}>
                                <Pressable
                                    style={styles.userContainer}
                                    onPress={() =>
                                        navigation.push('Profile', {
                                            userId: collection.user.id,
                                        })
                                    }>
                                    <UserAvatar
                                        photo={
                                            collection.user.profile_photo || ''
                                        }
                                        size={20}
                                    />

                                    <Text style={styles.userNameText}>
                                        {collection.user.username}
                                    </Text>
                                </Pressable>

                                <TouchableOpacity
                                    style={styles.followContainer}
                                    disabled={followButtonDisabled}
                                    onPress={toggleFollow}>
                                    {collection.is_followed[0].count > 0 ? (
                                        <>
                                            <Ionicons
                                                name="checkmark"
                                                size={16}
                                                color={PRIMARY_COLOR}
                                            />
                                            <Text style={styles.followText}>
                                                Followed
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesome6
                                                name="plus"
                                                size={14}
                                                color={PRIMARY_COLOR}
                                            />
                                            <Text style={styles.followText}>
                                                Follow
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.collectionNameText}>
                                {collection.name}
                            </Text>

                            {collection.description && (
                                <Text style={styles.descriptionText}>
                                    {collection.description}
                                </Text>
                            )}

                            <View style={styles.likePrivacyContainer}>
                                <View style={styles.likeContainer}>
                                    <LikeCollectionButton
                                        size={16}
                                        liked={liked}
                                        onLikeCommence={setToLiked}
                                        onUnlikeCommence={setToUnliked}
                                        onLikeComplete={success =>
                                            !success && setToUnliked()
                                        }
                                        onUnlikeComplete={success =>
                                            !success && setToLiked()
                                        }
                                        collectionId={collection.id}
                                    />
                                    <Text style={styles.likeText}>
                                        {collection.likes[0].count} likes
                                    </Text>
                                </View>

                                <View style={styles.privacyContainer}>
                                    {collection.public === 'PRIVATE' ? (
                                        <View style={styles.privacyItem}>
                                            <Entypo
                                                name="lock"
                                                size={12}
                                                color="#000"
                                            />

                                            <Text
                                                style={styles.privacyItemText}>
                                                Private
                                            </Text>
                                        </View>
                                    ) : collection.public === 'FRIENDS_ONLY' ? (
                                        <View style={styles.privacyItem}>
                                            <MaterialIcons
                                                name="people"
                                                size={14}
                                                color="#000"
                                            />
                                            <Text
                                                style={styles.privacyItemText}>
                                                Friends only
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={styles.privacyItem}>
                                            <Entypo
                                                name="globe"
                                                size={12}
                                                color="#000"
                                            />

                                            <Text
                                                style={styles.privacyItemText}>
                                                Public
                                            </Text>
                                        </View>
                                    )}

                                    {collection.public !== 'PRIVATE' &&
                                    collection.collaborative ? (
                                        <View style={styles.privacyItem}>
                                            <MaterialIcons
                                                name="people"
                                                size={14}
                                                color="#000"
                                            />
                                            <Text
                                                style={styles.privacyItemText}>
                                                Collaborative
                                            </Text>
                                        </View>
                                    ) : (
                                        collection.public !== 'PRIVATE' && (
                                            <View style={styles.privacyItem}>
                                                <MaterialIcons
                                                    name="person"
                                                    size={14}
                                                    color="#000"
                                                />
                                                <Text
                                                    style={
                                                        styles.privacyItemText
                                                    }>
                                                    Non-Collaborative
                                                </Text>
                                            </View>
                                        )
                                    )}
                                </View>
                            </View>
                        </View>
                    </>
                )
            }
            renderItem={({ item }) => (
                <SavedListItem
                    pub={item.pub}
                    onSaveCommence={id => toggleSave(id, true)}
                    onSaveComplete={(success, id) =>
                        !success ? toggleSave(id, false) : undefined
                    }
                    onUnsaveCommence={id => toggleSave(id, false)}
                    onUnsaveComplete={(success, id) =>
                        !success ? toggleSave(id, true) : undefined
                    }
                />
            )}
        />
    );
}

const styles = StyleSheet.create({
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
    likePrivacyContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 15,
    },
    likeContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    likeText: {
        fontSize: 12,
        marginLeft: 3,
    },
    privacyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
