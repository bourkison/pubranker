import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import {
    ListCollectionType,
    listFollowedCollectionsQuery,
} from '@/services/queries/collections';
import CollectionListItem from '@/components/Collections/CollectionListItem';
import { supabase } from '@/services/supabase';
import { useNavigation } from '@react-navigation/native';

const INITIAL_LOAD_AMOUNT = 10;

type CollectionsHomeProps = {
    collections: ListCollectionType[];
    setCollections: Dispatch<SetStateAction<ListCollectionType[]>>;
    hasLoaded: boolean;
    setHasLoaded: Dispatch<SetStateAction<boolean>>;
};

export default function CollectionsHome({
    collections,
    setCollections,
    hasLoaded,
    setHasLoaded,
}: CollectionsHomeProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            if (hasLoaded) {
                return;
            }

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

            setCollections(data.map(follow => follow.collections));
            setIsLoading(false);
            setHasLoaded(true);
        })();
    }, [hasLoaded, setHasLoaded, setCollections]);

    const refresh = useCallback(async () => {
        setIsRefreshing(true);

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
            setIsRefreshing(false);
            console.error(error);
            return;
        }

        setCollections(data.map(follow => follow.collections));
        setIsRefreshing(false);
    }, [setCollections]);

    return (
        <FlatList
            ListEmptyComponent={
                isLoading ? (
                    <ActivityIndicator />
                ) : (
                    <View>
                        <Text>
                            No collections yet. Hit the plus at the top right to
                            add.
                        </Text>
                    </View>
                )
            }
            data={collections}
            contentContainerStyle={styles.listContainer}
            onRefresh={refresh}
            refreshing={isRefreshing}
            renderItem={({ item }) => (
                <CollectionListItem
                    collection={item}
                    onPress={() =>
                        navigation.navigate('Home', {
                            screen: 'Favourites',
                            params: {
                                screen: 'CollectionView',
                                params: {
                                    collectionId: item.id,
                                },
                            },
                        })
                    }
                />
            )}
            keyExtractor={item => item.id.toString()}
        />
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
