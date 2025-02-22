import { CollectionType } from '@/services/queries/collections';
import React, { useEffect, useMemo, useRef } from 'react';
import { View, useWindowDimensions } from 'react-native';
import MapStyle from '@/json/map_style.json';
import PubMapMarker from '../Maps/PubMapMarker';
import { SECONDARY_COLOR } from '@/constants';
import { Camera, MapView, MarkerView } from '@rnmapbox/maps';
import { getMinMaxLatLong } from '@/services/geo';
import { Position } from '@turf/helpers';

type CollectionMapType = {
    collectionItems: CollectionType['collection_items'];
};

const ASPECT_RATIO = 0.8;
const PADDING = 80;

export default function CollectionMap({ collectionItems }: CollectionMapType) {
    const MapRef = useRef<MapView>(null);
    const CameraRef = useRef<Camera>(null);

    const points = useMemo<[number, number][]>(
        () =>
            collectionItems
                .map(collectionItem => collectionItem.pub.location.coordinates)
                .filter(pub => pub !== undefined),
        [collectionItems],
    );

    const { width } = useWindowDimensions();
    const height = useMemo<number>(() => width * ASPECT_RATIO, [width]);

    const bounds = useMemo<[Position, Position]>(() => {
        const minMaxLatLong = getMinMaxLatLong(points);

        if (!minMaxLatLong) {
            return [
                [0, 0],
                [0, 0],
            ];
        }

        return [
            [minMaxLatLong.minLong, minMaxLatLong.minLat],
            [minMaxLatLong.maxLong, minMaxLatLong.maxLat],
        ];
    }, [points]);

    useEffect(() => {
        CameraRef.current?.fitBounds(bounds[0], bounds[1], PADDING);
    }, [bounds]);

    return (
        <View>
            <MapView
                ref={MapRef}
                rotateEnabled={false}
                styleJSON={JSON.stringify(MapStyle)}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                scaleBarEnabled={false}
                style={[{ width, height }]}>
                <Camera
                    ref={CameraRef}
                    maxZoomLevel={16}
                    animationDuration={0}
                    animationMode="none"
                    bounds={{
                        ne: bounds[0],
                        sw: bounds[1],
                        paddingTop: PADDING,
                        paddingBottom: PADDING,
                        paddingLeft: PADDING,
                        paddingRight: PADDING,
                    }}
                />
                {points.map((p, index) => (
                    <MarkerView key={index} coordinate={p}>
                        <PubMapMarker
                            dotColor="#FFF"
                            pinColor={SECONDARY_COLOR}
                            onPress={() => console.log('test')}
                            outlineColor="#FFF"
                            width={32}
                        />
                    </MarkerView>
                ))}
            </MapView>
        </View>
    );
}
