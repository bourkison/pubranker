import { CollectionType } from '@/services/queries/collections';
import React, { useEffect, useMemo, useRef } from 'react';
import { View, useWindowDimensions } from 'react-native';
import MapView, { MapMarker } from 'react-native-maps';
import MapStyle from '@/json/map_style.json';
import PubMapMarker from '../Maps/PubMapMarker';
import { SECONDARY_COLOR } from '@/constants';

type CollectionMapType = {
    collectionItems: CollectionType['collection_items'];
};

const ASPECT_RATIO = 0.8;

export default function CollectionMap({ collectionItems }: CollectionMapType) {
    const MapRef = useRef<MapView>(null);

    const points = useMemo<[number, number][]>(
        () =>
            collectionItems
                .map(collectionItem => collectionItem.pub.location.coordinates)
                .filter(pub => pub !== undefined),
        [collectionItems],
    );

    const { width } = useWindowDimensions();
    const height = useMemo<number>(() => width * ASPECT_RATIO, [width]);

    useEffect(() => {
        MapRef.current?.fitToCoordinates(
            points.map(p => ({ longitude: p[0], latitude: p[1] })),
            {
                edgePadding: {
                    bottom: 80,
                    left: 80,
                    right: 80,
                    top: 80,
                },
            },
        );
    }, [points]);

    return (
        <View>
            <MapView
                ref={MapRef}
                rotateEnabled={false}
                showsUserLocation={false}
                showsMyLocationButton={false}
                customMapStyle={MapStyle}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                style={[{ width, height }]}>
                {points.map((p, index) => (
                    <MapMarker
                        key={index}
                        onPress={() => console.log('test')}
                        coordinate={{ longitude: p[0], latitude: p[1] }}>
                        <PubMapMarker
                            dotColor="#FFF"
                            pinColor={SECONDARY_COLOR}
                            outlineColor="#FFF"
                            width={32}
                        />
                    </MapMarker>
                ))}
            </MapView>
        </View>
    );
}
