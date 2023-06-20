import PubList from '@/components/Pubs/PubList';
import { supabase } from '@/services/supabase';
import { DiscoveredPub } from '@/types';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import * as Location from 'expo-location';

const METERS_WITHIN = 1000;
const INITIAL_AMOUNT = 3;

export default function Explore() {
    // TODO: Move this into a separate component.
    const [isLoading, setIsLoading] = useState(false);
    const [pubs, setPubs] = useState<DiscoveredPub[]>([]);

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
        <SafeAreaView>
            <Text>Explore</Text>
            <PubList pubs={pubs} isLoading={isLoading} />
        </SafeAreaView>
    );
}
