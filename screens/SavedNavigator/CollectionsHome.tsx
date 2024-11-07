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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SavedNavigatorStackParamList } from '@/nav/SavedNavigator';
import CreateCollectionIcon from '@/components/Collections/CreateCollectionIcon';
import {
    ListCollectionType,
    listFollowedCollectionsQuery,
} from '@/services/queries/collections';
import CollectionListItem from '@/components/Collections/CollectionListItem';

const INITIAL_LOAD_AMOUNT = 10;

export default function CollectionsHome() {
    const [isLoading, setIsLoading] = useState(false);
    const [collections, setCollections] = useState<ListCollectionType[]>([]);

    useEffect(() => {
        const fetchCollections = async () => {
            setIsLoading(true);

            const { data, error } = await listFollowedCollectionsQuery()
                .order('updated_at', { ascending: false })
                // TODO: This order is useless as its referencing when the pub was created_at
                .order('created_at', {
                    referencedTable: 'collections.pubs',
                    ascending: true,
                })
                .limit(INITIAL_LOAD_AMOUNT)
                .limit(8, { referencedTable: 'collections.pubs' });

            if (error) {
                setIsLoading(false);
                console.error(error);
                return;
            }

            console.log(
                'response',
                data[0].collections.pubs[0].id,
                data[0].collections.pubs.length,
            );

            setCollections(data.map(follow => follow.collections));
            setIsLoading(false);
        };

        fetchCollections();
    }, []);

    const navigation =
        useNavigation<StackNavigationProp<SavedNavigatorStackParamList>>();

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
                    <CollectionListItem collection={item} />
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
