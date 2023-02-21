import React, { useEffect, useRef, useState } from 'react';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapStyle from '../../mapStyle.json';
import { StyleSheet } from 'react-native';
import { supabase } from '@/services/supabase';
import { PubType } from '@/types';
import { setBottomBarState, setPub } from '@/store/slices/pub';
import { useAppDispatch } from '@/store/hooks';

const DELTA = 0.0075;

export default function HomeMap() {
    const [location, setLocation] = useState<Location.LocationObject | null>(
        null,
    );

    const MapRef = useRef<MapView>(null);

    const [pubs, setPubs] = useState<PubType[]>([]);

    const dispatch = useAppDispatch();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                // TODO: Error.
                return;
            }

            let l = await Location.getCurrentPositionAsync();
            setLocation(l);
        })();
    }, []);

    useEffect(() => {
        const f = async () => {
            const res = await supabase.from('pubs').select().limit(50);
            setPubs(res.data ? res.data : []);
        };

        f();
    }, []);

    const markerPress = (pub: PubType) => {
        dispatch(setPub(pub));
        if (MapRef.current) {
            MapRef.current.animateToRegion({
                // @ts-ignore
                latitude: pub.latitude - 0.15 * DELTA,
                // @ts-ignore
                longitude: pub.longitude,
                latitudeDelta: DELTA,
                longitudeDelta: DELTA,
            });
        }
    };

    return (
        <MapView
            provider="google"
            ref={MapRef}
            showsUserLocation={true}
            style={styles.map}
            onPanDrag={() => dispatch(setBottomBarState('hidden'))}
            customMapStyle={MapStyle}
            initialRegion={
                location
                    ? {
                          latitude: location.coords.latitude,
                          longitude: location.coords.longitude,
                          latitudeDelta: 0.01,
                          longitudeDelta: 0.01,
                      }
                    : undefined
            }>
            {pubs.map(pub => (
                <Marker
                    onPress={() => markerPress(pub)}
                    key={pub.id}
                    coordinate={{
                        // @ts-ignore
                        latitude: pub.latitude,
                        // @ts-ignore
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
        ...StyleSheet.absoluteFillObject,
    },
});
