import { supabase } from '@/services/supabase';
import { Tables } from '@/types/schema';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { distance, point } from '@turf/turf';

export type WishlistType = Tables<'wishlists'> & {
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
        wishlisted: { count: number }[];
    };
};

type WishlistsHomeProps = {
    wishlists: WishlistType['pub'][];
    setWishlists: Dispatch<SetStateAction<WishlistType['pub'][]>>;
    hasLoaded: boolean;
    setHasLoaded: Dispatch<SetStateAction<boolean>>;
    isLoggedIn: boolean;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

export default function WishlistsHome({
    hasLoaded,
    setIsLoggedIn,
    setWishlists,
    wishlists,
}: WishlistsHomeProps) {
    const [isLoading, setIsLoading] = useState(false);

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
                setIsLoggedIn(false);
                setIsLoading(false);
                return;
            }

            setIsLoggedIn(true);

            const { data, error } = await supabase
                .from('wishlists')
                .select(
                    `
                *,
                pub:pubs(
                    id, 
                    name, 
                    address,
                    num_reviews:reviews(count),
                    primary_photo, 
                    wishlisted:wishlists(count),
                    location:get_pub_location, 
                    rating:get_pub_rating
                )
            `,
                )
                .eq('user_id', userData.user.id)
                .eq('pub.wishlisted.user_id', userData.user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error(error);
                setIsLoading(false);
                return;
            }

            const { coords } = await Location.getCurrentPositionAsync();

            // @ts-ignore
            let temp: WishlistType['pub'][] = data.map(d => d.pub);

            temp = temp.map(pub => ({
                ...pub,
                dist_meters: distance(
                    point([coords.longitude, coords.latitude]),
                    point(pub.location.coordinates),
                    { units: 'meters' },
                ),
            }));

            setWishlists(temp);
            setIsLoading(false);
        })();
    }, [hasLoaded, setIsLoggedIn, setWishlists]);

    return (
        <FlatList
            ListEmptyComponent={
                isLoading ? (
                    <ActivityIndicator />
                ) : (
                    <View>
                        <Text>Empty</Text>
                    </View>
                )
            }
            data={wishlists}
            renderItem={({ item }) => (
                <View>
                    <Text>{item.name}</Text>
                </View>
            )}
            keyExtractor={item => item.id.toString()}
        />
    );
}
