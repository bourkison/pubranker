import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { PubSchema } from '@/types';
import PubListItem from '@/components/Pubs/RecommendedPub';
import * as Location from 'expo-location';
import { supabase } from '@/services/supabase';

const METERS_WITHIN = 1000;
const INITIAL_AMOUNT = 10;

type PubListProps = {};

export default function PubList({}: PubListProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [pubs, setPubs] = useState<PubSchema[]>([]);

    useEffect(() => {
        const initialLoad = async () => {
            setIsLoading(true);

            let l = await Location.getCurrentPositionAsync();

            const { data, error } = await supabase
                .rpc('nearby_pubs', {
                    order_lat: l.coords.latitude,
                    order_long: l.coords.longitude,
                    dist_lat: l.coords.latitude,
                    dist_long: l.coords.longitude,
                })
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
                        <PubListItem
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
