import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import RecommendedPub from '@/components/Pubs/RecommendedPub';
import * as Location from 'expo-location';
import { supabase } from '@/services/supabase';
import { Database } from '@/types/schema';

const METERS_WITHIN = 100_000_000;
const INITIAL_AMOUNT = 10;

type RecommendedPubListProps = {};

export default function RecommendedPubList({}: RecommendedPubListProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [pubs, setPubs] = useState<
        Database['public']['Functions']['get_pub_list_item']['Returns']
    >([]);

    useEffect(() => {
        const initialLoad = async () => {
            setIsLoading(true);

            let l = await Location.getCurrentPositionAsync();

            const { data, error } = await supabase
                .rpc('get_pub_list_item', {
                    lat: l.coords.latitude,
                    long: l.coords.longitude,
                })
                .order('dist_meters', { ascending: true })
                .lte('dist_meters', METERS_WITHIN)
                .limit(INITIAL_AMOUNT);

            if (error) {
                console.error(error);
                return;
            }

            setPubs(data);
            setIsLoading(false);
        };

        initialLoad();
    }, []);

    return (
        <View>
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <FlatList
                    horizontal={true}
                    data={pubs}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <RecommendedPub
                            pub={item}
                            onSaveToggle={(id, value) => {
                                const temp = pubs.slice();
                                const index = temp.findIndex(
                                    pub => pub.id === id,
                                );

                                if (index > -1) {
                                    temp[index].saved = value;
                                    setPubs(temp);
                                }
                            }}
                        />
                    )}
                />
            )}
        </View>
    );
}
