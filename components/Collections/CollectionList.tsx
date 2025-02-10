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
import { PubItemType } from '@/components/Pubs/PubItem';
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

            const { data, error } = await collectionQuery()
                .eq('id', collectionId)
                .eq('is_followed.user_id', userData.user.id)
                .order('created_at', {
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

            const { coords } = await Location.getCurrentPositionAsync();

            const { data: pubsData, error: pubsError } = await supabase
                .rpc('get_pub_list_item', {
                    lat: coords.latitude,
                    long: coords.longitude,
                })
                .in(
                    'id',
                    data.collection_items.map(c => c.pub_id),
                );

            if (pubsError) {
                console.error(pubsError);
                setIsLoading(false);
                return;
            }

            // Above query returns in order of pub_id - so must convert to
            // be in order of the collection_items.
            // collection_items is already in order from our query, so can just
            // loop through that.
            const orderedPubs: PubItemType[] = [];

            data.collection_items.forEach(orderedPub => {
                const desiredPub = pubsData.find(
                    unOrderedPub => orderedPub.pub_id === unOrderedPub.id,
                );

                if (!desiredPub) {
                    return;
                }

                orderedPubs.push(desiredPub);
            });

            setCollection({
                ...data,
                pubs: orderedPubs,
            });

            setIsLoading(false);
        })();
    }, [collectionId]);

    const toggleSave = useCallback(
        (id: number, isSave: boolean) => {
            if (!collection) {
                return;
            }

            const pubs = collection.pubs.slice();

            const index = pubs.findIndex(pub => pub.id === id);

            if (index > -1) {
                pubs[index].saved = isSave;
            }

            setCollection({ ...collection, pubs });
        },
        [collection],
    );

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

    const toggleFollow = useCallback(async () => {
        console.log('follow press');

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

    return (
        <FlatList
            data={collection?.pubs || []}
            keyExtractor={item => item.id.toString()}
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
                        {collection.pubs.length && (
                            <CollectionMap pubs={collection.pubs} />
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
                                        {collection.user.name}
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

                            <View style={styles.privacyContainer}>
                                {collection.public === 'PRIVATE' ? (
                                    <View style={styles.privacyItem}>
                                        <Entypo
                                            name="lock"
                                            size={12}
                                            color="#000"
                                        />

                                        <Text style={styles.privacyItemText}>
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
                                        <Text style={styles.privacyItemText}>
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

                                        <Text style={styles.privacyItemText}>
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
                                        <Text style={styles.privacyItemText}>
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
                                                style={styles.privacyItemText}>
                                                Non-Collaborative
                                            </Text>
                                        </View>
                                    )
                                )}
                            </View>
                        </View>
                    </>
                )
            }
            renderItem={({ item }) => (
                <SavedListItem
                    pub={item}
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
