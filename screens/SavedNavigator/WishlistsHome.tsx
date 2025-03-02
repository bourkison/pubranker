import { supabase } from '@/services/supabase';
import { Tables } from '@/types/schema';
import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { distance, point } from '@turf/turf';
import WishlistedListItem from '@/components/Saves/WishlistedListItem';

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
    setHasLoaded,
    setIsLoggedIn,
    setWishlists,
    wishlists,
}: WishlistsHomeProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchWishlists = useCallback(
        async (setLoading: Dispatch<SetStateAction<boolean>>) => {
            setLoading(true);

            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                console.warn(userError);
                setIsLoggedIn(false);
                setLoading(false);
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
                setLoading(false);
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
            setLoading(false);
            setHasLoaded(true);
        },
        [setHasLoaded, setIsLoggedIn, setWishlists],
    );

    useEffect(() => {
        (async () => {
            if (hasLoaded) {
                return;
            }

            fetchWishlists(setIsLoading);
        })();
    }, [hasLoaded, fetchWishlists]);

    const refresh = useCallback(
        () => fetchWishlists(setIsRefreshing),
        [fetchWishlists],
    );

    const toggleWishlist = useCallback(
        (id: number, isWishlist: boolean) => {
            const w = wishlists.slice();

            const index = w.findIndex(pub => pub.id === id);

            if (index > -1) {
                w[index].wishlisted[0].count = isWishlist ? 1 : 0;
            }

            setWishlists(w);
        },
        [wishlists, setWishlists],
    );

    // We check saved up here otherwise it doesn't update on
    // wishlist toggle.
    const isWishlisted = useCallback(
        (index: number) => {
            if (!wishlists[index]) {
                return false;
            }

            return wishlists[index].wishlisted[0].count > 0;
        },
        [wishlists],
    );

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
            renderItem={({ item, index }) => (
                <WishlistedListItem
                    pub={item}
                    wishlisted={isWishlisted(index)}
                    onWishlistCommence={id => toggleWishlist(id, true)}
                    onWishlistComplete={(success, id) =>
                        !success && toggleWishlist(id, false)
                    }
                    onUnwishlistCommence={id => toggleWishlist(id, false)}
                    onUnwishlistComplete={(success, id) =>
                        !success && toggleWishlist(id, true)
                    }
                />
            )}
            keyExtractor={item => item.id.toString()}
            refreshing={isRefreshing}
            onRefresh={refresh}
        />
    );
}
