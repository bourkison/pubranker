import React, { useEffect, useRef, useState } from 'react';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapStyle from '../../mapStyle.json';
import { StyleSheet } from 'react-native';
import { supabase } from '@/services/supabase';
import { PubType } from '@/types';
import { setBottomBarState, setPub } from '@/store/slices/pub';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { forcePubType } from '@/services';

const DELTA = 0.0075;

type HomeMapProps = {
    bottomPadding: number;
};

export default function HomeMap({ bottomPadding }: HomeMapProps) {
    const [location, setLocation] = useState<Location.LocationObject | null>(
        null,
    );

    const MapRef = useRef<MapView>(null);

    const [pubs, setPubs] = useState<PubType[]>([]);

    const dispatch = useAppDispatch();
    const selectedPub = useAppSelector(state => state.pub.selectedPub);

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
        const fetchPubs = async () => {
            const res = await supabase.from('pubs').select().limit(50);

            if (res.data && res.data.length) {
                setPubs(res.data.map((p: any) => forcePubType(p, [])));
            }
        };

        fetchPubs();
    }, []);

    useEffect(() => {
        if (selectedPub && MapRef && MapRef.current) {
            MapRef.current.animateToRegion({
                latitude: selectedPub.location.lat - 0.15 * DELTA,
                longitude: selectedPub.location.lng,
                latitudeDelta: DELTA,
                longitudeDelta: DELTA,
            });
        }
    }, [selectedPub, MapRef]);

    const panDrag = () => {
        dispatch(setBottomBarState('hidden'));
    };

    return (
        <MapView
            provider="google"
            ref={MapRef}
            showsUserLocation={true}
            style={styles.map}
            onPanDrag={panDrag}
            customMapStyle={MapStyle}
            mapPadding={{ bottom: bottomPadding, top: 0, right: 0, left: 0 }}
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
                    onPress={() => dispatch(setPub(pub))}
                    key={pub.id}
                    coordinate={{
                        latitude: pub.location.lat,
                        longitude: pub.location.lng,
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
