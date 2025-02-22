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

import { convertBoxToCoordinates } from '@/services/geo';
import { useWindowDimensions } from 'react-native';
import PubMapMarker from './PubMapMarker';
import { SECONDARY_COLOR } from '@/constants';
import GroupMapMarker from './GroupMapMarker';
import { useSharedMapContext } from '@/context/mapContext';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import { MarkerView } from '@rnmapbox/maps';

const markerAspectRatio = 207 / 263;

type MapPubType = { id: number; location: Point };

type MapMarkersProps = {
    mapBounds: Position[];
    pubs: { id: number; location: Point }[];
    markerWidth: number;
    onPubSelect?: (pub: MapPubType) => void;
    onGroupSelect?: (locations: Position[]) => void;
};

// TODO: Minimum delta to just show all pubs and not have any groupings.
// TODO: Probably over grouping here. If you have a group with 25 pubs this could easily be split out into 2 or 3 smaller groups that won't overlap each other. look into logic on how to do that.

export default function MapMarkers({
    mapBounds,
    pubs,
    markerWidth,
    onPubSelect,
    onGroupSelect,
}: MapMarkersProps) {
    const { width, height } = useWindowDimensions();

    const [markers, setMarkers] = useState<
        Array<MapPubType | { pubId: number; location: Point }[]>
    >([]);

    const { selectedMapPub: selectedPub } = useSharedMapContext();

    useEffect(() => {
        console.log('Calculating grouping');

        if (!mapBounds || !mapBounds[0] || !mapBounds[1]) {
            return;
        }

        console.log('Calculating grouping with map bounds', mapBounds);

        // First let's ensure these pubs are within bounds.
        // TODO: May want to add some padding on the screen.
        const markerHeight = markerWidth / markerAspectRatio;

        const deltaWidthPerPixel = 0.1 / width;
        const deltaHeightPerPixel = 0.1 / height;

        const ellipsisWidth = deltaWidthPerPixel * markerWidth;
        const ellipsisHeight = deltaHeightPerPixel * markerHeight;

        if (!ellipsisHeight || !ellipsisWidth) {
            return;
        }

        console.log(
            'Calculating grouping with ellipsis height',
            ellipsisHeight,
            ellipsisWidth,
        );

        const screenPolygon = polygon([
            convertBoxToCoordinates({
                minLat: mapBounds[0][1],
                minLong: mapBounds[0][0],
                maxLat: mapBounds[1][1],
                maxLong: mapBounds[1][0],
            }),
        ]);

        const pubsWithinScreen = pubs.filter(pub => {
            return booleanPointInPolygon(pub.location, screenPolygon);
        });

        console.log('pubs within screen', pubsWithinScreen.length);

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
        console.log('output array', JSON.stringify(outputArray));
    }, [mapBounds, pubs, height, markerWidth, width, selectedPub]);

    return (
        <>
            {markers.map(marker => {
                if (Array.isArray(marker)) {
                    const points = featureCollection(
                        marker.map(p => feature(p.location)),
                    );
                    const c = center(points);

                    console.log('TEST', marker);

                    return (
                        <MarkerView
                            key={marker.reduce(
                                (acc, curr) => acc + curr.pubId.toString(),
                                '',
                            )}
                            coordinate={c.geometry.coordinates}>
                            <GroupMapMarker
                                group={marker}
                                width={36}
                                onPress={onGroupSelect}
                                borderSize={4}
                                outlineColor="#FFF"
                                circleColor={SECONDARY_COLOR}
                                numberColor="#FFF"
                            />
                        </MarkerView>
                    );
                } else {
                    const selected = selectedPub?.id === marker.id;

                    return (
                        <MarkerView
                            key={marker.id.toString()}
                            coordinate={marker.location.coordinates}>
                            <PubMapMarker
                                onPress={() =>
                                    onPubSelect && onPubSelect(marker)
                                }
                                width={selected ? 36 : 32}
                                pinColor={selected ? '#000' : SECONDARY_COLOR}
                                outlineColor={selected ? '#000' : '#FFF'}
                                dotColor="#FFF"
                            />
                        </MarkerView>
                    );
                }
            })}
        </>
    );
}
