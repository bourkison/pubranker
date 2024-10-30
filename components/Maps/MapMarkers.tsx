import React, { useEffect, useState } from 'react';
import {
    Point,
    Feature,
    Polygon,
    MultiPolygon,
    feature,
    featureCollection,
    polygon,
} from '@turf/helpers';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import center from '@turf/center';
import ellipse from '@turf/ellipse';
import union from '@turf/union';

import { MapMarker, Region } from 'react-native-maps';
import { convertBoxToCoordinates } from '@/services/geo';
import { useWindowDimensions } from 'react-native';
import PubMapMarker from './PubMapMarker';
import { SECONDARY_COLOR } from '@/constants';
import { useAppSelector } from '@/store/hooks';
import GroupMapMarker from './GroupMapMarker';

const markerAspectRatio = 207 / 263;

type MapPubType = { id: number; location: Point };

type MapMarkersProps = {
    region: Region;
    pubs: { id: number; location: Point }[];
    markerWidth: number;
    onPubSelect?: (pub: MapPubType) => void;
    onGroupSelect?: (
        locations: { latitude: number; longitude: number }[],
    ) => void;
};

// TODO: Minimum delta to just show all pubs and not have any groupings.
// TODO: Probably over grouping here. If you have a group with 25 pubs this could easily be split out into 2 or 3 smaller groups that won't overlap each other. look into logic on how to do that.

export default function MapMarkers({
    region,
    pubs,
    markerWidth,
    onPubSelect,
    onGroupSelect,
}: MapMarkersProps) {
    const { width, height } = useWindowDimensions();

    const [markers, setMarkers] = useState<
        Array<MapPubType | { pubId: number; location: Point }[]>
    >([]);

    const selectedPub = useAppSelector(state => state.map.selected);

    useEffect(() => {
        // First let's ensure these pubs are within bounds.
        // TODO: May want to add some padding on the screen.
        const markerHeight = markerWidth / markerAspectRatio;

        const deltaWidthPerPixel = region.longitudeDelta / width;
        const deltaHeightPerPixel = region.latitudeDelta / height;

        const ellipsisWidth = deltaWidthPerPixel * markerWidth;
        const ellipsisHeight = deltaHeightPerPixel * markerHeight;

        if (!ellipsisHeight || !ellipsisWidth) {
            return;
        }

        const screenPolygon = polygon([
            convertBoxToCoordinates({
                minLong: region.longitude - region.longitudeDelta,
                minLat: region.latitude - region.latitudeDelta,
                maxLong: region.longitude + region.longitudeDelta,
                maxLat: region.latitude + region.latitudeDelta,
            }),
        ]);

        const pubsWithinScreen = pubs.filter(pub => {
            return booleanPointInPolygon(pub.location, screenPolygon);
        });

        let outputArray: Array<
            MapPubType | { pubId: number; location: Point }[]
        > = [];

        // This is taking an input of either 1 polygon (initial ellipsis) or multi polygon (merged ellipsis)
        // As well as the index to check from (to avoid checking over previously checked pubs).
        const recursiveCheckCollision = (
            inputPolygon: Feature<MultiPolygon | Polygon>,
            startIndex: number,
        ): [Point, number] | undefined => {
            for (let i = startIndex; i < pubsWithinScreen.length; i++) {
                // Don't check for collisions with the selectedPub.
                if (pubsWithinScreen[i].id === selectedPub?.id) {
                    continue;
                }

                if (
                    booleanPointInPolygon(
                        pubsWithinScreen[i].location,
                        inputPolygon,
                    )
                ) {
                    return [pubsWithinScreen[i].location, i];
                }
            }
        };

        for (let i = 0; i < pubsWithinScreen.length; i++) {
            const pub = pubsWithinScreen[i];

            // First step, build containing ellipsis around this pub that we will check for collisions within.
            let ellipsisPolygon: Feature<MultiPolygon | Polygon> = ellipse(
                pub.location,
                ellipsisWidth,
                ellipsisHeight,
                {
                    units: 'degrees',
                },
            );
            // Now loop through all other pubs that we haven't already checked in this loop
            // And see if there is a collision.
            // If so, we will merge these 2 pubs into their own array.
            // We do this recursively as, as we add more pubs into the array there may be more collisions (i.e. if Pub 1 collides with 2, and 2 collides with 3, but 1 doesn't collide with 3, we still want these grouped)
            // TODO: May want a fail safe here to avoid infinite loop.
            let output = [{ pubId: pub.id, location: pub.location }];

            while (true) {
                if (pub.id === selectedPub?.id) {
                    outputArray.push(pub);
                    break;
                }

                const collision = recursiveCheckCollision(
                    ellipsisPolygon,
                    i + 1,
                );

                if (!collision) {
                    if (output.length === 1) {
                        // No collisions, push entire pub not array
                        outputArray.push(pub);
                    } else {
                        outputArray.push(output);
                    }

                    break;
                }

                // If there's a collision, merge the 2 ellipsis polygons, push into output, remove pub from the pubsWithinScreen array, and check again for more collisions
                const [collisionPoint, collisionPointIndex] = collision;

                const u = union(
                    ellipsisPolygon,
                    ellipse(collisionPoint, ellipsisWidth, ellipsisHeight, {
                        units: 'degrees',
                    }),
                );

                if (!u) {
                    console.warn('error in polygon union');
                    continue;
                }

                ellipsisPolygon = u;
                output.push({
                    pubId: pubsWithinScreen[collisionPointIndex].id,
                    location: pubsWithinScreen[collisionPointIndex].location,
                });
                pubsWithinScreen.splice(collisionPointIndex, 1);
            }
        }

        setMarkers(outputArray);
    }, [region, pubs, height, markerWidth, width, selectedPub]);

    return (
        <>
            {markers.map(marker => {
                if (Array.isArray(marker)) {
                    const points = featureCollection(
                        marker.map(p => feature(p.location)),
                    );
                    const c = center(points);

                    return (
                        <MapMarker
                            key={marker.reduce(
                                (acc, curr) => acc + curr.pubId.toString(),
                                '',
                            )}
                            coordinate={{
                                latitude: c.geometry.coordinates[1],
                                longitude: c.geometry.coordinates[0],
                            }}
                            onPress={() => {
                                if (onGroupSelect) {
                                    onGroupSelect(
                                        marker.map(m => ({
                                            latitude: m.location.coordinates[1],
                                            longitude:
                                                m.location.coordinates[0],
                                        })),
                                    );
                                }
                            }}>
                            <GroupMapMarker
                                group={marker}
                                width={36}
                                borderSize={4}
                                outlineColor="#FFF"
                                circleColor={SECONDARY_COLOR}
                                numberColor="#FFF"
                            />
                        </MapMarker>
                    );
                } else {
                    const selected = selectedPub?.id === marker.id;

                    return (
                        <MapMarker
                            onPress={() => {
                                if (onPubSelect) {
                                    onPubSelect(marker);
                                }
                            }}
                            key={marker.id.toString()}
                            coordinate={{
                                latitude: marker.location.coordinates[1],
                                longitude: marker.location.coordinates[0],
                            }}
                            zIndex={selected ? 3 : 2}>
                            <PubMapMarker
                                width={selected ? 36 : 32}
                                pinColor={selected ? '#000' : SECONDARY_COLOR}
                                outlineColor={selected ? '#000' : '#FFF'}
                                dotColor="#FFF"
                            />
                        </MapMarker>
                    );
                }
            })}
        </>
    );
}
