import { WITH_ELLIPSE } from '@/constants';
import { parseLocation } from '@/services';
import { PubSchema } from '@/types';
import React, { useEffect, useMemo, useState } from 'react';

import { Geojson } from 'react-native-maps';
import * as turf from '@turf/turf';
import { useWindowDimensions } from 'react-native';

type DebugEllipseProps = {
    pubs: PubSchema[];
    deltas: {
        latitude: number;
        longitude: number;
    };
};

export default function DebugEllipse({ pubs, deltas }: DebugEllipseProps) {
    const { width, height } = useWindowDimensions();
    const [radiusWidth, setRadiusWidth] = useState(0.1);
    const [radiusHeight, setRadiusHeight] = useState(0.1);

    useEffect(() => {
        const pinAspectRatio = 207 / 263;
        const pinWidth = 32;
        const pinHeight = pinWidth / pinAspectRatio;

        let deltaWidthPerPixel = deltas.longitude / width;
        let deltaHeightPerPixel = deltas.latitude / height;

        setRadiusWidth(pinWidth * deltaWidthPerPixel);
        setRadiusHeight(pinHeight * deltaHeightPerPixel);
    }, [deltas, width, height]);

    const ellipseGeoJsonObjects = useMemo(() => {
        let features: turf.helpers.Feature<
            turf.helpers.Polygon | turf.helpers.MultiPolygon,
            turf.helpers.Properties
        >[] = [];

        if (!radiusWidth || !radiusHeight) {
            return turf.featureCollection(features);
        }

        const pubsWithPoints = pubs.map(pub => ({
            name: pub.name,
            location: parseLocation(pub.location),
        }));

        const recursiveCheckCollision = (
            inputPolygon: turf.helpers.Feature<
                turf.helpers.MultiPolygon | turf.helpers.Polygon
            >,
            startIndex: number,
        ): [turf.helpers.Point, number] | undefined => {
            for (let i = startIndex; i < pubsWithPoints.length; i++) {
                if (
                    turf.booleanPointInPolygon(
                        pubsWithPoints[i].location,
                        inputPolygon,
                    )
                ) {
                    return [pubsWithPoints[i].location, i];
                }
            }
        };

        for (let i = 0; i < pubsWithPoints.length; i++) {
            const pub = pubsWithPoints[i];

            console.log('ellipse created', pub.name);

            let polygon: turf.helpers.Feature<
                turf.helpers.MultiPolygon | turf.helpers.Polygon
            > = turf.ellipse(pub.location, radiusWidth, radiusHeight, {
                units: 'degrees',
            });

            // Check for collisions (only need to check future ones asprevious ones have already checked us)
            // As we add in more polygons there may be more collisions, hence we do this recursively.
            while (true) {
                const collision = recursiveCheckCollision(polygon, i + 1);

                if (!collision) {
                    console.log('No collision');
                    features.push(polygon);
                    break;
                }

                const [collisionPoint, collisionPointIndex] = collision;

                console.log(
                    'collision between',
                    pub.name,
                    pubsWithPoints[collisionPointIndex].name,
                );

                const union = turf.union(
                    polygon,
                    turf.ellipse(collisionPoint, radiusWidth, radiusHeight, {
                        units: 'degrees',
                    }),
                );

                if (!union) {
                    console.warn('error in polygon union');
                    continue;
                }

                polygon = union;
                pubsWithPoints.splice(collisionPointIndex, 1);
            }
        }

        return turf.featureCollection(features);
    }, [pubs, radiusWidth, radiusHeight]);

    if (!WITH_ELLIPSE) {
        return undefined;
    }

    return (
        <Geojson
            geojson={ellipseGeoJsonObjects}
            fillColor="rgba(0, 0, 0, 0.3)"
        />
    );
}
