import * as turf from '@turf/turf';
import { getType } from '@turf/turf';
import { BoundingBox } from '@/types';

export const convertBoxToCoordinates = (input: BoundingBox): number[][] => [
    [input.minLong, input.maxLat],
    [input.maxLong, input.maxLat],
    [input.maxLong, input.minLat],
    [input.minLong, input.minLat],
    [input.minLong, input.maxLat],
];

// TODO: Alot of improvements can be made on this function.
// i.e. should break up request to only get regions I haven't searched yet.
// (i.e. of 50% of screen) has been searched, only request the other 50%.
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
            throw new Error('No previously fetched');
        }

        if (!currentSelected) {
            throw new Error('No current selecteds');
        }

        let difference: turf.helpers.Feature<
            turf.helpers.Polygon | turf.helpers.MultiPolygon
        > | null = currentSelected;
        let prevPolygonsArr: turf.helpers.Feature<turf.helpers.Polygon>[];

        // booleanContains does not allow multipolygons so must convert to single.
        if (getType(previouslyFetched) === 'MultiPolygon') {
            const multiPrev =
                previouslyFetched as turf.helpers.Feature<turf.helpers.MultiPolygon>;

            prevPolygonsArr = multiPrev.geometry.coordinates.map(p =>
                turf.polygon(p),
            );
        } else {
            const singlePrev =
                previouslyFetched as turf.helpers.Feature<turf.helpers.Polygon>;
            prevPolygonsArr = [singlePrev];
        }

        for (let i = 0; i < prevPolygonsArr.length; i++) {
            if (!difference) {
                throw new Error('Error in removing differences');
            }

            const prevPolygon = prevPolygonsArr[i];

            // If we dont completely contain this polygon, take the difference out.
            if (!turf.booleanContains(currentSelected, prevPolygon)) {
                difference = turf.difference(difference, prevPolygon);
            } else {
                // If we do. Loop through our difference polygons and take the difference of prev polygon of those too?
                let diffPolygonsArr: turf.helpers.Feature<turf.helpers.Polygon>[];
                let responseDiffPolygonsArr: turf.helpers.Feature<turf.helpers.Polygon>[] =
                    [];

                if (getType(difference) === 'MultiPolygon') {
                    const multiDiff =
                        difference as turf.helpers.Feature<turf.helpers.MultiPolygon>;

                    diffPolygonsArr = multiDiff.geometry.coordinates.map(p =>
                        turf.polygon(p),
                    );
                } else {
                    const singleDiff =
                        difference as turf.helpers.Feature<turf.helpers.Polygon>;
                    diffPolygonsArr = [singleDiff];
                }

                for (let j = 0; j < diffPolygonsArr.length; j++) {
                    let response = diffPolygonsArr[j];

                    // If we dont completely contain this polygon, take the difference out.
                    if (!turf.booleanContains(response, prevPolygon)) {
                        let tempDiffResponse = turf.difference(
                            response,
                            prevPolygon,
                        );

                        if (!tempDiffResponse) {
                            throw new Error('Break on inner difference');
                        }

                        // Flatten multipolygon if it is.
                        if (getType(tempDiffResponse) === 'MultiPolygon') {
                            const multiConst =
                                tempDiffResponse as turf.helpers.Feature<turf.helpers.MultiPolygon>;

                            responseDiffPolygonsArr = [
                                ...responseDiffPolygonsArr,
                                ...multiConst.geometry.coordinates.map(p =>
                                    turf.polygon(p),
                                ),
                            ];
                        } else {
                            const polyConst =
                                tempDiffResponse as turf.helpers.Feature<turf.helpers.Polygon>;

                            responseDiffPolygonsArr = [
                                ...responseDiffPolygonsArr,
                                polyConst,
                            ];
                        }
                    } else {
                        // Else do the mask.
                        const poly1 = JSON.parse(
                            JSON.stringify(
                                turf.polygon(response.geometry.coordinates),
                            ),
                        );
                        const poly2 = JSON.parse(
                            JSON.stringify(
                                turf.polygon(prevPolygon.geometry.coordinates),
                            ),
                        );

                        let maskDiffResponse = turf.mask(poly2, poly1);

                        responseDiffPolygonsArr = [
                            ...responseDiffPolygonsArr,
                            maskDiffResponse,
                        ];
                    }
                }

                difference = turf.multiPolygon(
                    responseDiffPolygonsArr.map(s => s.geometry.coordinates),
                );
            }
        }

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
