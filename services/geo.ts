import {
    union,
    featureCollection,
    difference,
    polygon,
    booleanPointInPolygon,
} from '@turf/turf';
import type { Feature, Polygon, MultiPolygon, Position, Point } from 'geojson';
import { BoundingBox } from '@/types';
import * as boroughs from '@/json/boroughs.json';

export const convertBoxToCoordinates = (input: BoundingBox): number[][] => [
    [input.minLong, input.maxLat],
    [input.maxLong, input.maxLat],
    [input.maxLong, input.minLat],
    [input.minLong, input.minLat],
    [input.minLong, input.maxLat],
];

export const hasFetchedPreviously = (
    currentSelected: Feature<Polygon> | null,
    previouslyFetched: Feature<Polygon | MultiPolygon> | null,
): Feature<Polygon | MultiPolygon> | null => {
    try {
        if (!previouslyFetched) {
            return currentSelected;
        }

        if (!currentSelected) {
            throw new Error('No current selecteds');
        }

        const diff: Feature<Polygon | MultiPolygon> | null = difference(
            featureCollection([currentSelected, previouslyFetched]),
        );

        if (!diff) {
            throw new Error('Error in removing differences');
        }

        return diff;
    } catch (err) {
        // console.warn('difference:', err);
        return null;
    }
};

export const joinPolygons = (
    newPolygon: Feature<MultiPolygon | Polygon>,
    originalPolygon: Feature<MultiPolygon | Polygon> | null,
): Feature<MultiPolygon | Polygon> => {
    if (!originalPolygon) {
        return newPolygon;
    }

    const response = union(featureCollection([newPolygon, originalPolygon]));

    if (!response) {
        console.warn('Error in polygon union');
        return originalPolygon;
    }

    return response;
};

export const getMinMaxLatLong = (
    locations: Position[],
):
    | { minLong: number; minLat: number; maxLong: number; maxLat: number }
    | undefined => {
    let minLong: number | undefined;
    let minLat: number | undefined;
    let maxLat: number | undefined;
    let maxLong: number | undefined;

    locations.forEach(l => {
        if (minLong === undefined || l[0] < minLong) {
            minLong = l[0];
        }

        if (minLat === undefined || l[1] < minLat) {
            minLat = l[1];
        }

        if (maxLong === undefined || l[0] > maxLong) {
            maxLong = l[0];
        }

        if (maxLat === undefined || l[1] > maxLat) {
            maxLat = l[1];
        }
    });

    if (
        minLat === undefined ||
        minLong === undefined ||
        maxLat === undefined ||
        maxLong === undefined
    ) {
        return;
    }

    return {
        minLat,
        minLong,
        maxLat,
        maxLong,
    };
};

export const getBorough = (input: Point) => {
    for (let i = 0; i < boroughs.features.length; i++) {
        const borough = boroughs.features[i];
        const boroughPoly = polygon(boroughs.features[i].geometry.coordinates);

        if (booleanPointInPolygon(input, boroughPoly)) {
            return borough.properties.name;
        }
    }

    return 'London';
};
