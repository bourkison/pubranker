import * as turf from '@turf/turf';
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
    currentSelected: turf.helpers.Feature<turf.helpers.Polygon> | null,
    previouslyFetched: turf.helpers.Feature<
        turf.helpers.Polygon | turf.helpers.MultiPolygon
    > | null,
): turf.helpers.Feature<
    turf.helpers.Polygon | turf.helpers.MultiPolygon
> | null => {
    try {
        if (!previouslyFetched) {
            return currentSelected;
        }

        if (!currentSelected) {
            throw new Error('No current selecteds');
        }

        const difference: turf.helpers.Feature<
            turf.helpers.Polygon | turf.helpers.MultiPolygon
        > | null = turf.difference(currentSelected, previouslyFetched);

        if (!difference) {
            throw new Error('Error in removing differences');
        }

        return difference;
    } catch (err) {
        // console.warn('difference:', err);
        return null;
    }
};

export const joinPolygons = (
    newPolygon: turf.helpers.Feature<
        turf.helpers.MultiPolygon | turf.helpers.Polygon
    >,
    originalPolygon: turf.helpers.Feature<
        turf.helpers.MultiPolygon | turf.helpers.Polygon
    > | null,
): turf.helpers.Feature<turf.helpers.MultiPolygon | turf.helpers.Polygon> => {
    if (!originalPolygon) {
        return newPolygon;
    }

    const response = turf.union(newPolygon, originalPolygon);

    if (!response) {
        console.warn('Error in polygon union');
        return originalPolygon;
    }

    return response;
};

export const getBorough = (input: turf.Point) => {
    for (let i = 0; i < boroughs.features.length; i++) {
        const borough = boroughs.features[i];
        const boroughPoly = turf.polygon(
            boroughs.features[i].geometry.coordinates,
        );

        if (turf.booleanPointInPolygon(input, boroughPoly)) {
            return borough.properties.name;
        }
    }

    return 'London';
};
