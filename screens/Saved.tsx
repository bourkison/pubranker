import { useAppSelector } from '@/store/hooks';
import React, { useEffect } from 'react';
import { Text, SafeAreaView } from 'react-native';
import Unauthorized from '@/screens/Unauthorized';

import { supabase } from '@/services/supabase';
import * as Location from 'expo-location';

export default function SavedPubs() {
    const loggedIn = useAppSelector(state => state.user.loggedIn);
    const user = useAppSelector(state => state.user.docData);

    useEffect(() => {
        if (!loggedIn || !user) {
            return;
        }

        const fetchSaves = async () => {
            const currentLocation = await Location.getCurrentPositionAsync();

            const response = await supabase.rpc('saved_pubs', {
                input_id: user.id,
                dist_lat: currentLocation.coords.latitude,
                dist_long: currentLocation.coords.longitude,
            });

            console.log('SAVES 1:', JSON.stringify(response.data[0]));

            if (!response.data) {
                // TODO: handle error.
                return;
            }

            response.data;

            console.log('SAVES:', JSON.stringify(response));
        };

        fetchSaves();
    }, [loggedIn, user]);

    if (!loggedIn) {
        return <Unauthorized type="saved" />;
    }

    return (
        <SafeAreaView>
            <Text>Saved Pubs</Text>
        </SafeAreaView>
    );
}
