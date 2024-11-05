import { PubItemType } from '@/components/Pubs/PubItem';
import SavedListItem from '@/components/Saves/SavedListItem';
import { SavedNavigatorStackParamList } from '@/nav/SavedNavigator';
import { supabase } from '@/services/supabase';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
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

type CollectionType = {
    id: number;
    name: string;
    description: string | null;
    pubs: PubItemType[];
    user: {
        id: string;
        name: string;
        profile_photo: string | null;
    };
};

export default function CollectionsView({
    navigation,
    route,
}: StackScreenProps<SavedNavigatorStackParamList, 'CollectionsView'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [collection, setCollection] = useState<CollectionType>();
    const [isFollowed, setIsFollowed] = useState(false);

    useEffect(() => {
        const fetchCollection = async () => {
            setIsLoading(true);

            const { error: userError } = await supabase.auth.getUser();

            if (userError) {
                console.error(userError);
                setIsLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('collections')
                .select(
                    `
                id,
                name,
                description,
                collection_items(pub_id, created_at),
                user:users_public(id, name, profile_photo)
                `,
                )
                .eq('id', route.params.collectionId)
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

            console.log('collection', data);

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
                id: data.id,
                name: data.name,
                description: data.description,
                pubs: orderedPubs,
                user: data.user,
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
                    <Text style={styles.headerText}>Collection</Text>
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
                        <View style={styles.listHeaderContainer}>
                            <View style={styles.topListHeaderContainer}>
                                <View style={styles.userContainer}>
                                    <UserAvatar
                                        photo={
                                            collection.user.profile_photo || ''
                                        }
                                        size={14}
                                    />

                                    <Text style={styles.userNameText}>
                                        {collection.user.name}
                                    </Text>
             