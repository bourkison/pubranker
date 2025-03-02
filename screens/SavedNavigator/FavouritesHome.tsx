import { Tables } from '@/types/schema';
import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from 'react';
import {
    FlatList,
    View,
    Text,
    useWindowDimensions,
    ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { supabase } from '@/services/supabase';
import { User } from '@supabase/supabase-js';
import { distance, point } from '@turf/turf';
import Unauthorized from '@/screens/Unauthorized';
import SavedListItem from '@/components/Saves/SavedListItem';

export type SavedType = Tables<'saves'> & {
    pub: {
        id: number;
        name: string;
        address: string;
        primary_photo: string | null;
        location: {
            coordinates: [number, number];
            type: string;
        };
        dist_meters: number;
        rating: number;
        num_reviews: { count: number }[];
        saved: { count: number }[];
    };
};

type FavouritesHomeProps = {
    favourites: SavedType['pub'][];
    setFavourites: Dispatch<SetStateAction<SavedType['pub'][]>>;
    hasLoaded: boolean;
    setHasLoaded: Dispatch<SetStateAction<boolean>>;
    isLoggedIn: boolean;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

export default function FavouritesHome({
    favourites,
    setFavourites,
    hasLoaded,
    setHasLoaded,
    isLoggedIn,
    setIsLoggedIn,
}: FavouritesHomeProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { width } = useWindowDimensions();

    const fetchSavedPromise = useCallback(
        (userData: User) => {
            return new Promise<void>(async (resolve, reject) => {
                // TODO: Do i need a filter on saved?
                const { data: savesData, error: savesError } = await supabase
                    .from('saves')
                    .select(
                        `*, 
                        pub:pubs(
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
                let temp: SavedType['pub'][] = savesData.map(s => s.pub);

                temp = temp.map(pub => ({
                    ...pub,
                    dist_meters: distance(
                        point([coords.longitude, coords.latitude]),
                        point(pub.location.coordinates),
                        { units: 'meters' },
                    ),
                }));

                setFavourites(temp);
                resolve();
            });
        },
        [setFavourites],
    );

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

        await fetchSavedPromise(userData.user);

        setIsRefreshing(false);
    }, [fetchSavedPromise, setIsLoggedIn]);

    const toggleSave = useCallback(
        (id: number, isSave: boolean) => {
            const f = favourites.slice();

            const index = f.findIndex(pub => pub.id === id);

            if (index > -1) {
                f[index].saved[0].count = isSave ? 1 : 0;
            }

            setFavourites(f);
        },
        [favourites, setFavourites],
    );

    // We check saved up here otherwise it doesn't update on
    // Save toggle.
    const isSaved = useCallback(
        (index: number) => {
            if (!favourites[index]) {
                return false;
            }

            return favourites[index].saved[0].count > 0;
        },
        [favourites],
    );

    useEffect(() => {
        (async () => {
            if (hasLoaded) {
                return;
            }

            setIsLoading(true);

            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                console.warn(userError);
                setIsLoading(false);
                return;
            }

            setIsLoggedIn(true);

            await fetchSavedPromise(userData.user);

            setIsLoading(false);
            setHasLoaded(true);
        })();
    }, [fetchSavedPromise, hasLoaded, setHasLoaded, setIsLoggedIn]);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (!isLoggedIn) {
        return <Unauthorized type="saved" />;
    }

    return (
        <FlatList
            ListEmptyComponent={
                <View>
                    <Text>Empty</Text>
                </View>
            }
            data={favourites}
            renderItem={({ item, index }) => (
                <View
                    style={{
                        width,
                    }}>
                    <SavedListItem
                        pub={item}
                        saved={isSaved(index)}
                        onSaveCommence={id => toggleSave(id, true)}
                        onSaveComplete={(success, id) =>
                            !success && toggleSave(id, false)
                        }
                        onUnsaveCommence={id => toggleSave(id, false)}
                        onUnsaveComplete={(success, id) =>
                            !success && toggleSave(id, true)
                        }
                    />
                </View>
            )}
            keyExtractor={item => item.id.toString()}
            refreshing={isRefreshing}
            onRefresh={refresh}
        />
    );
}
