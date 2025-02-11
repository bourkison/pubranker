import React, { useMemo, useRef } from 'react';
import MapView, { MapMarker } from 'react-native-maps';
import MapStyle from '@/json/map_style.json';
import { StyleSheet, useWindowDimensions } from 'react-native';
import PubMapMarker from '@/components/Maps/PubMapMarker';
import { SECONDARY_COLOR } from '@/constants';
import { FetchPubType } from '@/services/queries/pub';

type PubMapProps = {
    pub: FetchPubType;
};

const MAP_PADDING = 30;

export default function PubMap({ pub }: PubMapProps) {
    const { width } = useWindowDimensions();
    const pubLocation = useMemo(() => pub.location, [pub]);

    const mapRef = useRef<MapView>(null);

    return (
        <>
            <MapView
                ref={mapRef}
                initialRegion={{
                    latitude: pubLocation.coordinates[1],
                    longitude: pubLocation.coordinates[0],
                    latitudeDelta: 0.006,
                    longitudeDelta: 0.006,
                }}
                rotateEnabled={false}
                showsUserLocation={true}
                showsMyLocationButton={false}
                pointerEvents="none"
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
                    }}>
                    <PubMapMarker
                        dotColor="#FFF"
                        pinColor={SECONDARY_COLOR}
                        outlineColor="#FFF"
                        width={32}
                    />
                </MapMarker>
            </MapView>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        borderRadius: 5,
        marginBottom: 10,
    },
    separator: {
        marginHorizontal: 30,
        borderTopWidth: 1,
        borderColor: '#E5E7EB',
    },
});
