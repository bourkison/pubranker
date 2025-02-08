import { PubItemType } from '@/components/Pubs/PubItem';
import SavedListItem from '@/components/Saves/SavedListItem';
import { SavedNavigatorStackParamList } from '@/nav/SavedNavigator';
import { supabase } from '@/services/supabase';
import {
    Ionicons,
    FontAwesome6,
    MaterialIcons,
    Entypo,
} from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import UserAvatar from '@/components/User/UserAvatar';
import { PRIMARY_COLOR } from '@/constants';
import { v4 as uuidv4 } from 'uuid';
import {
    collectionQuery,
    CollectionType,
} from '@/services/queries/collections';
import CollectionMap from '@/components/Collections/CollectionMap';

export default function CollectionView({
    navigation,
    route,
}: StackScreenProps<SavedNavigatorStackParamList, 'CollectionView'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [collection, setCollection] = useState<CollectionType>();

    useEffect(() => {
        const fetchCollection = async () => {
            setIsLoading(true);

            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                console.error(userError);
                setIsLoading(false);
                return;
            }

            const { data, error } = await collectionQuery()
                .eq('id', route.params.collectionId)
                .eq('is_followed.user_id', userData.user?.id || uuidv4())
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

            console.log('collection', JSON.stringify(data));

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
        };

        fetchCollection();
    }, [route]);

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
                    !collection ? undefined : (
                        <>
                            <CollectionMap pubs={collection.pubs} />
                            <View style={styles.listHeaderContainer}>
                                <View style={styles.topListHeaderContainer}>
                                    <View style={styles.userContainer}>
                                        <UserAvatar
                                            photo={
                                                collection.user.profile_photo ||
                                                ''
                                            }
                                            size={14}
                                        />

                                        <Text style={styles.userNameText}>
                                            {collection.user.name}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.followContainer}
                                        onPress={() =>
                                            console.log('toggle follow')
                                        }>
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

                                <MaterialIcons name="person" />
                                <MaterialIcons name="people" />
                                <Entypo name="globe" />
                                <Entypo name="lock" />
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
});
