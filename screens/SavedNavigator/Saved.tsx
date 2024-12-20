import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    SafeAreaView,
    FlatList,
    ActivityIndicator,
    View,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native';
import Unauthorized from '@/screens/Unauthorized';

import { supabase } from '@/services/supabase';
import * as Location from 'expo-location';
import { Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PubItemType } from '@/components/Pubs/PubItem';
import { User } from '@supabase/supabase-js';
import { StackScreenProps } from '@react-navigation/stack';
import { SavedNavigatorStackParamList } from '@/nav/SavedNavigator';
import CreateCollectionIcon from '@/components/Collections/CreateCollectionIcon';
import SavedListItem from '@/components/Saves/SavedListItem';

export default function SavedPubs({
    navigation,
}: StackScreenProps<SavedNavigatorStackParamList, 'SavedHome'>) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pubs, setPubs] = useState<PubItemType[]>([]);
    const [collectionsAmount, setCollectionsAmount] = useState(0);

    const { width } = useWindowDimensions();

    useEffect(() => {
        const fetchSavedPromise = (userData: User) => {
            return new Promise<void>(async (resolve, reject) => {
                const { data: savesData, error: savesError } = await supabase
                    .from('saves')
                    .select()
                    .eq('user_id', userData.id)
                    .order('created_at', { ascending: false });

                if (savesError) {
                    reject(savesError);
                    return;
                }

                const { coords } = await Location.getCurrentPositionAsync();

                const { data, error } = await supabase
                    .rpc('get_pub_list_item', {
                        lat: coords.latitude,
                        long: coords.longitude,
                    })
                    .in(
                        'id',
                        savesData.map(save => save.pub_id),
                    );

                if (error) {
                    console.error(error);
                    reject();
                    return;
                }

                const orderedPubs: PubItemType[] = [];

                savesData.forEach(save => {
                    const pub = data.find(p => p.id === save.pub_id);

                    if (!pub) {
                        console.warn('pub not found', save.pub_id);
                        return;
                    }

                    orderedPubs.push(pub);
                });

                if (error) {
                    reject(error);
                    return;
                }

                setPubs(data);
                resolve();
            });
        };

        const fetchCollectionsPromise = (userData: User) => {
            return new Promise<void>(async (resolve, reject) => {
                const { count: collectionsCount, error: collectionsError } =
                    await supabase
                        .from('collection_follows')
                        .select('count', { count: 'exact' })
                        .eq('user_id', userData.id);

                if (collectionsError) {
                    reject(collectionsError);
                    return;
                }

                setCollectionsAmount(collectionsCount ?? 0);
                resolve();
            });
        };

        const fetchSaved = async () => {
            setIsLoading(true);
            setIsLoggedIn(false);

            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                console.warn(userError);
                setIsLoading(false);
                return;
            }

            setIsLoggedIn(true);

            await Promise.allSettled([
                fetchSavedPromise(userData.user),
                fetchCollectionsPromise(userData.user),
            ]);

            setIsLoading(false);
        };

        fetchSaved();
    }, []);

    const toggleSave = useCallback(
        (id: number, isSave: boolean) => {
            const p = pubs.slice();

            const index = p.findIndex(pub => pub.id === id);

            if (index > -1) {
                p[index].saved = isSave;
            }

            setPubs(p);
        },
        [pubs],
    );

    const collectionsAmountText = useMemo<string>(() => {
        if (collectionsAmount === 0) {
            return 'No lists';
        }

        if (collectionsAmount === 1) {
            return '1 list';
        }

        return `${collectionsAmount} lists`;
    }, [collectionsAmount]);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (!isLoggedIn) {
        return <Unauthorized type="saved" />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.settingsContainer}>
                    <Feather name="settings" size={18} color="#00000000" />
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Favourites</Text>
                </View>

                <View style={styles.menuContainer}>
                    <CreateCollectionIcon />
                </View>
            </View>
            <FlatList
                ListEmptyComponent={
                    <View>
                        <Text>Empty</Text>
                    </View>
                }
                ListHeaderComponent={
                    <TouchableOpacity
                        style={styles.collectionsContainer}
                        onPress={() => navigation.navigate('CollectionsHome')}>
                        <View>
                            <Text style={styles.collectionsText}>
                                {collectionsAmountText}
                            </Text>
                        </View>

                        <View>
                            <Feather name="chevron-right" size={18} />
                        </View>
                    </TouchableOpacity>
                }
                data={pubs}
                renderItem={({ item }) => (
                    <View
                        style={{
                            width,
                        }}>
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
                    </View>
                )}
                keyExtractor={item => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        onRefresh={() => {
                            setIsRefreshing(false);
                            console.log('refresh');
                        }}
                        refreshing={isRefreshing}
                    />
                }
            />
        </SafeAreaView>
    );
}

const ICON_PADDING = 10;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    collectionsContainer: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    collectionsText: {
        fontSize: 14,
        fontWeight: '300',
    },
    headerContainer: {
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    settingsContainer: {
        paddingLeft: ICON_PADDING,
    },
    menuContainer: {
        paddingRight: ICON_PADDING,
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
});
