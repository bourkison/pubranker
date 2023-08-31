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
        const features = pubs.map(pub => {
            const location = parseLocation(pub.location);

            const polygon = turf.ellipse(location, radiusWidth, radiusHeight, {
                units: 'degrees',
            });

            return polygon;
        });

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
