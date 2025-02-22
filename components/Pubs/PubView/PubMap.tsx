import React, { useRef } from 'react';
import MapStyle from '@/json/map_style.json';
import { StyleSheet, useWindowDimensions } from 'react-native';
import PubMapMarker from '@/components/Maps/PubMapMarker';
import { SECONDARY_COLOR } from '@/constants';
import { FetchPubType } from '@/services/queries/pub';
import { Camera, MapView, MarkerView } from '@rnmapbox/maps';

type PubMapProps = {
    pub: FetchPubType;
};

const MAP_PADDING = 30;

export default function PubMap({ pub }: PubMapProps) {
    const { width } = useWindowDimensions();
    const CameraRef = useRef<Camera>(null);

    return (
        <>
            <MapView
                rotateEnabled={false}
                pointerEvents="none"
                zoomEnabled={false}
                pitchEnabled={false}
                scrollEnabled={false}
                scaleBarEnabled={false}
                compassEnabled={false}
                style={[
                    styles.map,
                    {
                        width: width - MAP_PADDING * 2,
                        height: (width - MAP_PADDING * 2) / 1.3333,
                        marginHorizontal: MAP_PADDING,
                    },
                ]}
                styleJSON={JSON.stringify(MapStyle)}>
                <Camera
                    ref={CameraRef}
                    animationDuration={0}
                    animationMode="none"
                    centerCoordinate={pub.location.coordinates}
                    zoomLevel={14}
                />

                <MarkerView coordinate={pub.location.coordinates}>
                    <PubMapMarker
                        dotColor="#FFF"
                        pinColor={SECONDARY_COLOR}
                        outlineColor="#FFF"
                        width={32}
                    />
                </MarkerView>
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
