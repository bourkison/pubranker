import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { supabase } from '@/services/supabase';
import { Tables } from '@/types/schema';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableHighlight,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

type CollectionContext = Tables<'collections'> & {
    is_added: {
        count: number;
    }[];
    user: {
        username: string;
        profile_photo: string;
        id: string;
    };
};

export default function AddToList({
    route,
    navigation,
}: StackScreenProps<MainNavigatorStackParamList, 'AddToList'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [collections, setCollections] = useState<CollectionContext[]>([]);

    useEffect(() => {
        const fetchCollections = async () => {
            setIsLoading(true);

            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                console.error(userError);
                setIsLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('collections')
                .select(
                    `
                    *, 
                    is_added:collection_items(count), 
                    user:users_public!collections_user_id_fkey1(id, username, profile_photo)
                    `,
                )
                .eq('user_id', userData.user.id)
                .eq('is_added.pub_id', route.params.pubId);

            setIsLoading(false);

            if (error) {
                console.error(error);
                return;
            }

            setCollections(data);
        };

        fetchCollections();
    }, [route]);

    const addToCollection = useCallback(
        async (collectionId: number) => {
            setIsAdding(true);

            const { error } = await supabase.from('collection_items').insert({
                collection_id: collectionId,
                pub_id: route.params.pubId,
            });

            if (error) {
                console.error(error);
                setIsAdding(false);
                return;
            }

            navigation.goBack();
        },
        [route, navigation],
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Add to List</Text>
                </View>
            </View>

            <FlatList
                data={collections}
                ListEmptyComponent={
                    isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <View>
                            <Text>No lists.</Text>
                        </View>
                    )
                }
                ListHeaderComponent={
                    <TouchableHighlight style={styles.newListContainer}>
                        <>
                            <Text>New list</Text>

                            <Feather
                                name="chevron-right"
                                size={18}
                                color={'rgba(0, 0, 0, 0.6)'}
                            />
                        </>
                    </TouchableHighlight>
                }
                renderItem={({ item }) => (
                    <TouchableHighlight
                        disabled={isAdding}
                        style={styles.listContainer}
                        underlayColor="#E5E7EB"
                        activeOpacity={1}
                        onPress={() => addToCollection(item.id)}>
                        <Text>
                            {item.name}{' '}
                            {item.is_added[0].count > 0
                                ? '(already added)'
                                : ''}
                        </Text>
                    </TouchableHighlight>
                )}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingVertical: 12,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Jost',
        textAlign: 'center',
    },
    headerTextContainer: {
        flex: 1,
    },
    listContainer: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    newListContainer: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
});
