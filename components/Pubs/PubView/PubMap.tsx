import { parseLocation } from '@/services';
import { PubSchema } from '@/types';
import React, { useEffect, useMemo, useRef } from 'react';
import MapView, { MapMarker } from 'react-native-maps';
import MapStyle from '@/json/map_style.json';
import { StyleSheet, useWindowDimensions } from 'react-native';
import * as Location from 'expo-location';

type PubMapProps = {
    pub: PubSchema;
};

const MAP_PADDING = 30;

export default function PubMap({ pub }: PubMapProps) {
    const { width } = useWindowDimensions();
    const pubLocation = useMemo(() => parseLocation(pub.location), [pub]);

    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        console.log('USE EFFECT');

        (async () => {
            const l = await Location.getCurrentPositionAsync();

            mapRef.current?.fitToCoordinates(
                [
                    {
                        latitude: pubLocation.coordinates[1],
                        longitude: pubLocation.coordinates[0],
                    },
                    {
                        latitude: l.coords.latitude,
                        longitude: l.coords.longitude,
                    },
                ],
                {
                    edgePadding: {
                        bottom: 40,
                        left: 40,
                        right: 40,
                        top: 40,
                    },
                },
            );
        })();
    }, [pubLocation, mapRef]);

    return (
        <MapView
            provider="google"
            ref={mapRef}
            initialRegion={{
                latitude: pubLocation.coordinates[1],
                longitude: pubLocation.coordinates[0],
                latitudeDelta: 0.022,
                longitudeDelta: 0.021,
            }}
            rotateEnabled={false}
            showsUserLocation={true}
            showsMyLocationButton={false}
            style={[
                styles.map,
                {
                    width: width - MAP_PADDING * 2,
                    height: (width - MAP_PADDING * 2) / 1.3333,
                    marginHorizontal: MAP_PADDING,
                },
            ]}
            customMapStyle={MapStyle}>
            <MapMarker
                coordinate={{
                    latitude: pubLocation.coordinates[1],
                    longitude: pubLocation.coordinates[0],
                }}
            />
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        borderRadius: 5,
    },
});
