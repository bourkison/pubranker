import React from 'react';
import { Point, feature, featureCollection } from '@turf/helpers';
import center from '@turf/center';
import PubMapMarker from './PubMapMarker';
import { SECONDARY_COLOR } from '@/constants';
import GroupMapMarker from './GroupMapMarker';
import { useSharedMapContext } from '@/context/mapContext';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import { MarkerView } from '@rnmapbox/maps';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const markerAspectRatio = 207 / 263;
export type MapPubType = { id: number; location: Point };

type MapMarkersProps = {
    markers: Array<MapPubType | MapPubType[]>;
    onPubSelect?: (pub: MapPubType) => void;
    onGroupSelect?: (locations: Position[]) => void;
};

// TODO: Minimum delta to just show all pubs and not have any groupings.
// TODO: Probably over grouping here. If you have a group with 25 pubs this could easily be split out into 2 or 3 smaller groups that won't overlap each other. look into logic on how to do that.

export default function MapMarkers({
    markers,
    onPubSelect,
    onGroupSelect,
}: MapMarkersProps) {
    const { selectedMapPub: selectedPub } = useSharedMapContext();

    return (
        <>
            {markers.map(marker => {
                if (Array.isArray(marker)) {
                    const points = featureCollection(
                        marker.map(p => feature(p.location)),
                    );
                    const c = center(points);

                    return (
                        <MarkerView
                            // Merge all IDs to make a unique key
                            key={marker.reduce(
                                (acc, curr) => acc + curr.id.toString(),
                                '',
                            )}
                            coordinate={c.geometry.coordinates}>
                            <Animated.View entering={FadeIn} exiting={FadeOut}>
                                <GroupMapMarker
                                    group={marker}
                                    width={36}
                                    onPress={onGroupSelect}
                                    borderSize={4}
                                    outlineColor="#FFF"
                                    circleColor={SECONDARY_COLOR}
                                    numberColor="#FFF"
                                />
                            </Animated.View>
                        </MarkerView>
                    );
                } else {
                    const selected = selectedPub?.id === marker.id;

                    return (
                        <MarkerView
                            key={marker.id.toString()}
                            coordinate={marker.location.coordinates}>
                            <Animated.View entering={FadeIn} exiting={FadeOut}>
                                <PubMapMarker
                                    onPress={() =>
                                        onPubSelect && onPubSelect(marker)
                                    }
                                    width={selected ? 36 : 32}
                                    pinColor={
                                        selected ? '#000' : SECONDARY_COLOR
                                    }
                                    outlineColor={selected ? '#000' : '#FFF'}
                                    dotColor="#FFF"
                                />
                            </Animated.View>
                        </MarkerView>
                    );
                }
            })}
        </>
    );
}
