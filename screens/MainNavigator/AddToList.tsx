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
    TouchableOpacity,
} from 'react-native';
import { Feather, Entypo, MaterialIcons } from '@expo/vector-icons';
import Header from '@/components/Utility/Header';
import * as Haptics from 'expo-haptics';

type CollectionContext = Tables<'collections'> & {
    is_added: {
        count: number;
    }[];
    pubs: { count: number }[];
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

    const [selectedCollections, setSelectedCollections] = useState<number[]>(
        [],
    );

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

            const { data, error } = await supabase
                .from('collections')
                .select(
                    `
                    *, 
                    is_added:collection_items(count),
                    pubs:collection_items(count),
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
        })();
    }, [route]);

    const toggleSelect = useCallback(
        (id: number) => {
            Haptics.selectionAsync();

            if (selectedCollections.includes(id)) {
                // REMOVE.
                const index = selectedCollections.findIndex(x => id === x);

                if (index === -1) {
                    return;
                }

                const array = selectedCollections.slice();
                array.splice(index, 1);
                setSelectedCollections(array);

                return;
            }

            setSelectedCollections([...selectedCollections, id]);
        },
        [selectedCollections],
    );

    const addToCollection = useCallback(async () => {
        if (selectedCollections.length === 0) {
            return;
        }

        setIsAdding(true);

        const { error } = await supabase.from('collection_items').insert(
            selectedCollections.map(c => ({
                collection_id: c,
                pub_id: route.params.pubId,
            })),
        );

        if (error) {
            console.error(error);
            setIsAdding(false);
            return;
        }

        navigation.goBack();
    }, [route, navigation, selectedCollections]);

    return (
        <View style={styles.container}>
            <Header
                header="Add to List"
                leftColumn={
                    <TouchableOpacity
                        style={styles.cancelContainer}
                        onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelText}>Back</Text>
                    </TouchableOpacity>
                }
                rightColumn={
                    <TouchableOpacity
                        disabled={isAdding || selectedCollections.length === 0}
                        style={styles.addContainer}
                        onPress={addToCollection}>
                        <Text style={styles.addText}>Add</Text>
                    </TouchableOpacity>
                }
            />

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
                    <TouchableHighlight style={styles.listContainer}>
                        <>
                            <Text style={styles.titleText}>New list</Text>

                            <Feather
                                name="chevron-right"
                                size={18}
                                color={'rgba(0, 0, 0, 0.6)'}
                            />
                        </>
                    </TouchableHighlight>
                }
                renderItem={({ item }) => {
                    const isSelected = selectedCollections.includes(item.id);
                    const isAdded = item.is_added[0].count > 0;

                    return (
                        <TouchableHighlight
                            disabled={isAdding || item.is_added[0].count > 0}
                            style={[
                                styles.listContainer,
                                isSelected ? styles.selectedList : undefined,
                            ]}
                            underlayColor="#E5E7EB"
                            activeOpacity={1}
                            onPress={() => toggleSelect(item.id)}>
                            <>
                                <View>
                                    <View style={styles.topRowContainer}>
                                        <Text style={styles.titleText}>
                                            {item.name}{' '}
                                        </Text>
                                        <Text style={styles.mutedText}>
                                            {isAdded ? '(already added)' : ''}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={styles.subtitleText}>
                                            {item.pubs[0].count} pubs
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.iconsContainer}>
                                    {isSelected && (
                                        <View
                                            style={
                                                styles.selectedIconContainer
                                            }>
                                            <Entypo
                                                name="check"
                                                size={18}
                                                color="#000"
                                            />
                                        </View>
                                    )}

                                    {!isAdded && (
                                        <View
                                            style={styles.publicIconContainer}>
                                            {item.public === 'PUBLIC' ? (
                                                <Entypo
                                                    name="globe"
                                                    size={12}
                                                    color="#000"
                                                />
                                            ) : item.public ===
                                              'FRIENDS_ONLY' ? (
                                                <MaterialIcons
                                                    name="people"
                                                    size={14}
                                                    color="#000"
                                                />
                                            ) : (
                                                <Entypo
                                                    name="lock"
                                                    size={12}
                                                    color="#000"
                                                />
                                            )}
                                        </View>
                                    )}
                                </View>
                            </>
                        </TouchableHighlight>
                    );
                }}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cancelContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    cancelText: {
        fontWeight: '300',
    },
    addContainer: {
        flex: 1,
        alignItems: 'flex-end',
        paddingHorizontal: 10,
    },
    addText: {
        fontWeight: '500',
    },
    listContainer: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    selectedList: {
        backgroundColor: '#E5E7EB',
    },
    mutedText: {
        color: 'rgba(0, 0, 0, 0.4)',
        fontSize: 10,
    },
    titleText: {
        fontSize: 14,
        fontWeight: '500',
        verticalAlign: 'middle',
    },
    subtitleText: {
        fontSize: 10,
        marginTop: 3,
    },
    topRowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    publicIconContainer: {},
    selectedIconContainer: {
        marginRight: 5,
    },
});
