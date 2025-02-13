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
import { User } from '@supabase/supabase-js';
import SavedListItem from '@/components/Saves/SavedListItem';
import { CollectionType } from '@/services/queries/collections';
import Header from '@/components/Utility/Header';
import { distance, point } from '@turf/turf';
import { SavedNavigatorScreenProps } from '@/types/nav';

export default function SavedPubs({
    navigation,
}: SavedNavigatorScreenProps<'SavedHome'>) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pubs, setPubs] = useState<CollectionType['pubs']>([]);
    const [collectionsAmount, setCollectionsAmount] = useState(0);

    const { width } = useWindowDimensions();

    const fetchSavedPromise = useCallback((userData: User) => {
        return new Promise<void>(async (resolve, reject) => {
            const { data: savesData, error: savesError } = await supabase
                .from('saves')
                .select(
                    `*, 
                    pubs(
                        id, 
                        name, 
                        address,
                        num_reviews:reviews(count),
                        primary_photo, 
                        saved:saves(count),
                        location:get_pub_location, 
                        rating:get_pub_rating
                    )`,
                )
                .eq('user_id', userData.id)
                .order('created_at', { ascending: false });

            if (savesError) {
                console.error('SAVES ERROR', savesError);
                reject(savesError);
                return;
            }

            const { coords } = await Location.getCurrentPositionAsync();

            // @ts-ignore
            let temp: CollectionType['pubs'] = savesData.map(s => s.pubs);

            temp = temp.map(pub => ({
                ...pub,
                dist_meters: distance(
                    point([coords.longitude, coords.latitude]),
                    point(pub.location.coordinates),
                    { units: 'meters' },
                ),
            }));

            setPubs(temp);
            resolve();
        });
    }, []);

    const fetchCollectionsPromise = useCallback((userData: User) => {
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
    }, []);

    useEffect(() => {
        (async () => {
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
        })();
    }, [fetchSavedPromise, fetchCollectionsPromise]);

    const refresh = useCallback(async () => {
        setIsRefreshing(true);

        const { data: userData, error: userError } =
            await supabase.auth.getUser();

        if (userError) {
            console.warn(userError);
            setIsLoggedIn(false);
            setIsLoading(false);
            return;
        }

        setIsLoggedIn(true);

        await Promise.allSettled([
            fetchSavedPromise(userData.user),
            fetchCollectionsPromise(userData.user),
        ]);

        setIsRefreshing(false);
    }, [fetchSavedPromise, fetchCollectionsPromise]);

    const toggleSave = useCallback(
        (id: number, isSave: boolean) => {
            const p = pubs.slice();

            const index = p.findIndex(pub => pub.id === id);

            if (index > -1) {
                p[index].saved[0].count = isSave ? 1 : 0;
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
            <Header
                header="Favourites"
                leftColumn={<View style={styles.cancelContainer} />}
                rightColumn={
                    <TouchableOpacity
                        onPress={() => navigation.navigate('CreateCollection')}
                        style={styles.createContainer}>
                        <Feather name="plus" size={14} />
                    </TouchableOpacity>
                }
            />

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
                refreshing={isRefreshing}
                onRefresh={refresh}
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
    cancelContainer: {
        paddingLeft: ICON_PADDING,
        flex: 1,
    },
    createContainer: {
        paddingRight: ICON_PADDING,
        flex: 1,
        alignItems: 'flex-end',
    },
});
