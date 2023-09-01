import { parseLocation } from '@/services';
import { PubSchema } from '@/types';
import React, { useEffect, useState } from 'react';
import * as turf from '@turf/turf';
import { Geojson, MapMarker, Region } from 'react-native-maps';
import { convertBoxToCoordinates } from '@/services/geo';
import { useWindowDimensions } from 'react-native';
import PubMapMarker from './PubMapMarker';
import { SECONDARY_COLOR } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPub } from '@/store/slices/map';

type MapMarkersProps = {
    region: Region;
    pubs: PubSchema[];
    markerWidth: number;
};

const markerAspectRatio = 207 / 263;

type MapPubType = Omit<PubSchema, 'location'> & {
    location: turf.helpers.Point;
};

export default function MapMarkers({
    region,
    pubs,
    markerWidth,
}: MapMarkersProps) {
    const { width, height } = useWindowDimensions();

    const [markers, setMarkers] = useState<
        Array<MapPubType | { pubId: number; location: turf.helpers.Point }[]>
    >([]);

    const dispatch = useAppDispatch();
    const selectedPub = useAppSelector(state => state.map.selected);

    useEffect(() => {
        // First let's ensure these pubs are within bounds.
        // TODO: May want to add some padding on the screen.
        const screenPolygon = turf.polygon([
            convertBoxToCoordinates({
                minLong: region.longitude - region.longitudeDelta,
                minLat: region.latitude - region.latitudeDelta,
                maxLong: region.longitude + region.longitudeDelta,
                maxLat: region.latitude + region.latitudeDelta,
            }),
        ]);

        const pubsWithinScreen = pubs
            .map(pub => ({
                ...pub,
                location: parseLocation(pub.location),
            }))
            .filter(pub => {
                return turf.booleanPointInPolygon(pub.location, screenPolygon);
            });

        let outputArray: Array<
            MapPubType | { pubId: number; location: turf.helpers.Point }[]
        > = [];

        const markerHeight = markerWidth / markerAspectRatio;

        const deltaWidthPerPixel = region.longitudeDelta / width;
        const deltaHeightPerPixel = region.latitudeDelta / height;

        const ellipsisWidth = deltaWidthPerPixel * markerWidth;
        const ellipsisHeight = deltaHeightPerPixel * markerHeight;

        if (!ellipsisHeight || !ellipsisWidth) {
            return;
        }

        // Let's build the recursive collision function: we'll be using later.
        // This is taking an input of either 1 polygon (initial ellipsis) or multi polygon (merged ellipsis)
        // As well as the index to check from (to avoid checking over previously checked pubs).
        const recursiveCheckCollision = (
            inputPolygon: turf.helpers.Feature<
                turf.helpers.MultiPolygon | turf.helpers.Polygon
            >,
            startIndex: number,
        ): [turf.helpers.Point, number] | undefined => {
            for (let i = startIndex; i < pubsWithinScreen.length; i++) {
                if (
                    turf.booleanPointInPolygon(
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
            let ellipsisPolygon: turf.helpers.Feature<
                turf.helpers.MultiPolygon | turf.helpers.Polygon
            > = turf.ellipse(pub.location, ellipsisWidth, ellipsisHeight, {
                units: 'degrees',
            });
            // Now loop through all other pubs that we haven't already checked in this loop
            // And see if there is a collision.
            // If so, we will merge these 2 pubs into their own array.
            // We do this recursively as, as we add more pubs into the array there may be more collisions (i.e. if Pub 1 collides with 2, and 2 collides with 3, but 1 doesn't collide with 3, we still want these grouped)
            // TODO: May want a fail safe here to avoid infinite loop.
            let output = [{ pubId: pub.id, location: pub.location }];

            while (true) {
                const collision = recursiveCheckCollision(
                    ellipsisPolygon,
                    i + 1,
                );

                if (!collision) {
                    if (output.length === 1) {
                        // No collisions, push entire pub not array
                        console.log('NO COLLISIONS', pub.name);
                        outputArray.push(pub);
                    } else {
                        console.log(output.length, 'COLLISIONS', pub.name);
                        outputArray.push(output);
                    }

                    break;
                }

                // If there's a collision, merge the 2 ellipsis polygons, push into output, remove pub from the pubsWithinScreen array, and check again for more collisions
                const [collisionPoint, collisionPointIndex] = collision;

                const union = turf.union(
                    ellipsisPolygon,
                    turf.ellipse(
                        collisionPoint,
                        ellipsisWidth,
                        ellipsisHeight,
                        {
                            units: 'degrees',
                        },
                    ),
                );

                if (!union) {
                    console.warn('error in polygon union');
                    continue;
                }

                ellipsisPolygon = union;
                output.push({
                    pubId: pubsWithinScreen[collisionPointIndex].id,
                    location: pubsWithinScreen[collisionPointIndex].location,
                });
                pubsWithinScreen.splice(collisionPointIndex, 1);
            }
        }

        setMarkers(outputArray);
    }, [region, pubs, height, markerWidth, width]);

    return (
        <>
            {markers.map(marker => {
                if (Array.isArray(marker)) {
                    return undefined;
                } else {
                    const selected = selectedPub?.id === marker.id;

                    return (
                        <MapMarker
                            onPress={() => {
                                dispatch(
                                    selectPub({
                                        ...marker,
                                        location: JSON.stringify(
                                            marker.location,
                                        ),
                                    }),
                                );
                            }}
                            key={marker.id}
                            coordinate={{
                                latitude: marker.location.coordinates[1],
                                longitude: marker.location.coordinates[0],
                            }}>
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
