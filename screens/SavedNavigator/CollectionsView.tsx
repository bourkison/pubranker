import { PubItemType } from '@/components/Pubs/PubItem';
import { SavedNavigatorStackParamList } from '@/nav/SavedNavigator';
import { supabase } from '@/services/supabase';
import { Ionicons } from '@expo/vector-icons';
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
import PubItem from '@/components/Pubs/PubItem';

type CollectionType = {
    id: number;
    name: string;
    pubs: PubItemType[];
};

export default function CollectionsView({
    navigation,
    route,
}: StackScreenProps<SavedNavigatorStackParamList, 'CollectionsView'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [collection, setCollection] = useState<CollectionType>();

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
                collection_items(pub_id, created_at)
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
                console.log('index found', index, pubs[index], isSave);
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
                    <Text style={styles.headerText}>
                        {collection?.name || 'Collection'}
                    </Text>
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
                renderItem={({ item }) => (
                    <PubItem
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
});
