import { CollectionType } from '@/services/queries/collections';
import { supabase } from '@/services/supabase';
import React, { useCallback, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Pressable,
} from 'react-native';
import { PRIMARY_COLOR } from '@/constants';
import {
    Ionicons,
    FontAwesome6,
    Entypo,
    MaterialIcons,
} from '@expo/vector-icons';
import CollectionMap from '@/components/Collections/CollectionMap';
import UserAvatar from '@/components/User/UserAvatar';
import { StackActions, useNavigation } from '@react-navigation/native';
import LikeCollectionButton from '@/components/Collections/LikeCollectionButton';
import CollectionItemListItem from './CollectionItemListItem';
import CollectionCollaborators from './CollectionCollaborators';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type CollectionListProps = {
    collection?: CollectionType;
    setFollow: (follow: boolean) => void;
    setLiked: (like: boolean) => void;
    toggleSave: (id: number, save: boolean) => void;
    onItemRemove?: (id: number) => void;
    refresh: () => void;
    isRefreshing: boolean;
    canEdit: boolean;
    userId: string;
    isLoading: boolean;
};

export default function CollectionList({
    collection,
    isLoading,
    userId,
    toggleSave,
    refresh,
    isRefreshing,
    setFollow,
    setLiked,
    onItemRemove,
    canEdit,
}: CollectionListProps) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [createCommentVisible, setCreateCommentVisible] = useState(true);
    const [scrollOffset, setScrollOffset] = useState(0);

    const navigation = useNavigation();

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

    const commentText = useMemo<string>(() => {
        if (!collection) {
            return 'Comment';
        }

        if (collection.comments[0].count > 0) {
            return `${collection.comments[0].count} comments`;
        }

        return 'Comment';
    }, [collection]);

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

            setFollow(false);
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

            setFollow(true);
        }

        setIsFollowing(false);
    }, [collection, isFollowing, setFollow]);

    const setToLiked = useCallback(() => setLiked(true), [setLiked]);
    const setToUnliked = useCallback(() => setLiked(false), [setLiked]);

    const showComments = useCallback(
        (y: number) => {
            const offset = scrollOffset;
            setScrollOffset(y);

            if (y <= 0) {
                // At top of list.
                setCreateCommentVisible(true);
                return;
            }

            if (y > offset) {
                // Scrolling down.
                setCreateCommentVisible(false);
                return;
            }

            // Else we're scrolling up.
            setCreateCommentVisible(true);
        },
        [scrollOffset],
    );

    // We check saved up here ot    herwise it doesn't update on
    // Save toggle.
    const isSaved = useCallback(
        (index: number) => {
            if (!collection || !collection.collection_items[index]) {
                return false;
            }

            return collection.collection_items[index].pub.saved[0].count > 0;
        },
        [collection],
    );

    return (
        <>
            <FlatList
                onScroll={({
                    nativeEvent: {
                        contentOffset: { y },
                    },
                }) => {
                    showComments(y);
                }}
                data={collection?.collection_items || []}
                keyExtractor={item => item.pub.id.toString()}
                onRefresh={refresh}
                refreshing={isRefreshing}
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
                                    collectionItems={
                                        collection.collection_items
                                    }
                                />
                            )}
                            <View style={styles.listHeaderContainer}>
                                <View style={styles.topListHeaderContainer}>
                                    <Pressable
                                        style={styles.userContainer}
                                        onPress={() => {
                                            const pushAction =
                                                StackActions.push('Profile', {
                                                    userId: collection.user.id,
                                                });

                                            navigation.dispatch(pushAction);
                                        }}>
                                        <UserAvatar
                                            photo={
                                                collection.user.profile_photo ||
                                                ''
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
                                                    style={
                                                        styles.privacyItemText
                                                    }>
                                                    Private
                                                </Text>
                                            </View>
                                        ) : collection.public ===
                                          'FRIENDS_ONLY' ? (
                                            <View style={styles.privacyItem}>
                                                <MaterialIcons
                                                    name="people"
                                                    size={14}
                                                    color="#000"
                                                />
                                                <Text
                                                    style={
                                                        styles.privacyItemText
                                                    }>
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
                                                    style={
                                                        styles.privacyItemText
                                                    }>
                                                    Public
                                                </Text>
                                            </View>
                                        )}

                                        {collection.collaborative && (
                                            <View style={styles.privacyItem}>
                                                <MaterialIcons
                                                    name="people"
                                                    size={14}
                                                    color="#000"
                                                />
                                                <Text
                                                    style={
                                                        styles.privacyItemText
                                                    }>
                                                    Collaborative
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                            {collection.collaborative && (
                                <CollectionCollaborators
                                    collection={collection}
                                />
                            )}
                        </>
                    )
                }
                renderItem={({ item, index }) => (
                    <CollectionItemListItem
                        collaborativeCollection={
                            collection?.collaborative || false
                        }
                        rankedCollection={collection?.ranked || false}
                        index={index}
                        onRemove={onItemRemove}
                        canEdit={canEdit}
                        collectionItem={item}
                        saved={isSaved(index)}
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

            {collection && createCommentVisible && (
                <Pressable
                    onPress={() =>
                        navigation.navigate('CollectionComments', {
                            collectionId: collection.id,
                        })
                    }>
                    <Animated.View
                        style={styles.commentContainer}
                        entering={FadeIn.duration(150)}
                        exiting={FadeOut.duration(150)}>
                        <Text style={styles.commentText}>{commentText}</Text>
                    </Animated.View>
                </Pressable>
            )}
        </>
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
        fontWeight: '500',
        fontSize: 14,
        letterSpacing: -0.2,
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
    commentContainer: {
        position: 'absolute',
        bottom: 15,
        paddingHorizontal: 12,
        paddingVertical: 10,
        alignSelf: 'center',
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: {
            height: 0,
            width: 0,
        },
    },
    commentText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '500',
    },
});
