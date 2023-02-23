import React, { RefObject, useEffect, useRef, useState } from 'react';

import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import MapStyle from '../../mapStyle.json';
import { Keyboard, StyleSheet } from 'react-native';
import { setPub } from '@/store/slices/pub';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import BottomSheet from '@gorhom/bottom-sheet';
import { fetchMapPubs } from '@/store/slices/map';

const ANIMATE_DELTA = 0.0075;
const INITIAL_DELTA = 0.01;

type HomeMapProps = {
    bottomPadding: number;
    bottomSheetRef: RefObject<BottomSheet>;
};

export default function HomeMap({
    bottomPadding,
    bottomSheetRef,
}: HomeMapProps) {
    const [location, setLocation] = useState<Location.LocationObject | null>(
        null,
    );

    const MapRef = useRef<MapView>(null);

    const dispatch = useAppDispatch();
    const selectedPub = useAppSelector(state => state.pub.selectedPub);
    const pubs = useAppSelector(state => state.map.pubs);

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

    const fetchPubs = (region: Region) => {
        dispatch(
            fetchMapPubs({
                minLat:
                    region.latitude -
                    region.latitudeDelta / 2 +
                    region.latitudeDelta * 0.01,
                minLong:
                    region.longitude -
                    region.longitudeDelta / 2 +
                    region.longitudeDelta * 0.01,
                maxLat:
                    region.latitude +
                    region.latitudeDelta / 2 +
                    region.latitudeDelta * 0.01,
                maxLong:
                    region.longitude +
                    region.longitudeDelta / 2 +
                    region.longitudeDelta * 0.01,
            }),
        );
    };

    useEffect(() => {
        if (selectedPub && MapRef && MapRef.current) {
            MapRef.current.animateToRegion({
                latitude: selectedPub.location.lat - 0.15 * ANIMATE_DELTA,
                longitude: selectedPub.location.lng,
                latitudeDelta: ANIMATE_DELTA,
                longitudeDelta: ANIMATE_DELTA,
            });
        }
    }, [selectedPub, MapRef]);

    const panDrag = () => {
        if (bottomSheetRef && bottomSheetRef.current) {
            bottomSheetRef.current.collapse();
        }

        Keyboard.dismiss();
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
            onRegionChangeComplete={fetchPubs}
            initialRegion={
                location
                    ? {
                          latitude: location.coords.latitude,
                          longitude: location.coords.longitude,
                          latitudeDelta: INITIAL_DELTA,
                          longitudeDelta: INITIAL_DELTA,
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
