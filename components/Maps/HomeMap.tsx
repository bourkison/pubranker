import React, { useEffect, useState } from 'react';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapStyle from '../../mapStyle.json';
import { StyleSheet } from 'react-native';
import { supabase } from '@/services/supabase';
import { PubType } from '@/types';

export default function HomeMap() {
    const [location, setLocation] = useState<Location.LocationObject | null>(
        null,
    );

    const [pubs, setPubs] = useState<PubType[]>([]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                // TODO: Error.
                return;
            }

            let l = await Location.getCurrentPositionAsync();
            setLocation(l);
            console.log('LOCATION:', l);
        })();
    }, []);

    useEffect(() => {
        const f = async () => {
            const res = await supabase.from('pubs').select().limit(50);
            setPubs(res.data ? res.data : []);
        };

        f();
    }, []);

    return (
        <MapView
            provider="google"
            showsUserLocation={true}
            style={styles.map}
            customMapStyle={MapStyle}
            initialRegion={
                location
                    ? {
                          latitude: location.coords.latitude,
                          longitude: location.coords.longitude,
                          latitudeDelta: 0.0082,
                          longitudeDelta: 0.0092,
                      }
                    : undefined
            }>
            {pubs.map(pub => (
                <Marker
                    onPress={() => console.log('PRESS:', pub)}
                    key={pub.id}
                    coordinate={{
                        latitude: pub.latitude,
                        longitude: pub.longitude,
                    }}
                    title={pub.name}
                />
            ))}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});
