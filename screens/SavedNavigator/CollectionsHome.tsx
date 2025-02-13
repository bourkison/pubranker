import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CreateCollectionIcon from '@/components/Collections/CreateCollectionIcon';
import {
    ListCollectionType,
    listFollowedCollectionsQuery,
} from '@/services/queries/collections';
import CollectionListItem from '@/components/Collections/CollectionListItem';
import { supabase } from '@/services/supabase';
import { SavedNavigatorScreenProps } from '@/types/nav';

const INITIAL_LOAD_AMOUNT = 10;

export default function CollectionsHome({
    navigation,
}: SavedNavigatorScreenProps<'CollectionsHome'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [collections, setCollections] = useState<ListCollectionType[]>([]);

    useEffect(() => {
        const fetchCollections = async () => {
            setIsLoading(true);

            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                console.error(userError);
                return;
            }

            const { data, error } = await listFollowedCollectionsQuery()
                .eq('user_id', userData.user.id)
                .order('updated_at', { ascending: false })
                .order('order', {
                    referencedTable: 'collections.collection_items',
                    ascending: true,
                })
                .limit(INITIAL_LOAD_AMOUNT)
                .limit(8, { referencedTable: 'collections.collection_items' });

            if (error) {
                setIsLoading(false);
                console.error(error);
                return;
            }

            console.log('response', data[0].collections.user);

            setCollections(data.map(follow => follow.collections));
            setIsLoading(false);
        };

        fetchCollections();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.settingsContainer}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={14} />
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Lists</Text>
                </View>

                <View style={styles.menuContainer}>
                    <CreateCollectionIcon />
                </View>
            </View>

            <FlatList
                ListEmptyComponent={
                    isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <View>
                            <Text>
                                No collections yet. Hit the plus at the top
                                right to add.
                            </Text>
                        </View>
                    )
                }
                data={collections}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <CollectionListItem
                        collection={item}
                        onPress={() =>
                            navigation.navigate('CollectionView', {
                                collectionId: item.id,
                            })
                        }
                    />
                )}
                keyExtractor={item => item.id.toString()}
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
    listContainer: {},
});
