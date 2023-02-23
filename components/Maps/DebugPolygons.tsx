import { WITH_POLYGONS } from '@/screens/constants';
import { useAppSelector } from '@/store/hooks';
import { getType } from '@turf/turf';
import * as turf from '@turf/turf';
import React, { useMemo } from 'react';
import { Polygon } from 'react-native-maps';

export default function DebugPolygons() {
    const previouslyFetched = useAppSelector(
        state => state.map.previouslyFetchedPolygon,
    );
    const currentSelected = useAppSelector(
        state => state.map.currentSelectedPolygon,
    );

    const previouslySelectedLatLngPolygon = useMemo(() => {
        if (!WITH_POLYGONS) {
            return [];
        }

        try {
            if (previouslyFetched) {
                if (getType(previouslyFetched) === 'MultiPolygon') {
                    const multi =
                        previouslyFetched as turf.helpers.Feature<turf.helpers.MultiPolygon>;

                    const response = multi.geometry.coordinates.map(
                        firstLayer => {
                            return firstLayer.map(secondLayer => {
                                return secondLayer.map(thirdLayer => {
                                    return {
                                        latitude: thirdLayer[1],
                                        longitude: thirdLayer[0],
                                    };
                                });
                            });
                        },
                    );

                    return response;
                } else if (getType(previouslyFetched) === 'Polygon') {
                    const poly =
                        previouslyFetched as turf.helpers.Feature<turf.helpers.Polygon>;

                    const response = [
                        poly.geometry.coordinates.map(firstLayer => {
                            return firstLayer.map(secondLayer => {
                                return {
                                    latitude: secondLayer[1],
                                    longitude: secondLayer[0],
                                };
                            });
                        }),
                    ];

                    return response;
                } else {
                    throw new Error('Unrecognised poly');
                }
            } else {
                throw new Error('No poly');
            }
        } catch (err) {
            // console.warn('previous:', err);
            return [];
        }
    }, [previouslyFetched]);

    const currentSelectedLatLngPolygon = useMemo(() => {
        if (!WITH_POLYGONS) {
            return [];
        }

        try {
            if (!currentSelected) {
                throw new Error('No current selecteds');
            }

            const poly =
                currentSelected as turf.helpers.Feature<turf.helpers.Polygon>;

            const response = [
                poly.geometry.coordinates.map(firstLayer => {
                    return firstLayer.map(secondLayer => {
                        return {
                            latitude: secondLayer[1],
                            longitude: secondLayer[0],
                        };
                    });
                }),
            ];

            return response;
        } catch (err) {
            // console.warn('selected:', err);
            return [];
        }
    }, [currentSelected]);

    const differenceLatLngPolygon = useMemo(() => {
        if (!WITH_POLYGONS) {
            return [];
        }

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

                    console.log('DOESNT COMPLETELY CONTAIN.');
                } else {
                    // If we do. Loop through our difference polygons and take the difference of prev polygon of those too?
                    let diffPolygonsArr: turf.helpers.Feature<turf.helpers.Polygon>[];
                    let responseDiffPolygonsArr: turf.helpers.Feature<turf.helpers.Polygon>[] =
                        [];

                    if (getType(difference) === 'MultiPolygon') {
                        const multiDiff =
                            difference as turf.helpers.Feature<turf.helpers.MultiPolygon>;

                        diffPolygonsArr = multiDiff.geometry.coordinates.map(
                            p => turf.polygon(p),
                        );
                    } else {
                        const singleDiff =
                            difference as turf.helpers.Feature<turf.helpers.Polygon>;
                        diffPolygonsArr = [singleDiff];
                    }

                    console.log('COMPLETELY CONTAINS. LOOPING THROUGH', i);

                    for (let j = 0; j < diffPolygonsArr.length; j++) {
                        let response = diffPolygonsArr[j];

                        // If we dont completely contain this polygon, take the difference out.
                        if (!turf.booleanContains(response, prevPolygon)) {
                            console.log(
                                'DOESNT COMPLETELY CONTAIN INNER POLYGON',
                                i,
                                j,
                            );

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
                            console.log(
                                'COMPLETELY CONTAINS INNER POLYGON',
                                i,
                                j,
                                response,
                                prevPolygon,
                            );

                            let temp = prevPolygon;

                            let maskDiffResponse = turf.mask(response, temp);

                            console.log('mask response:', maskDiffResponse);

                            responseDiffPolygonsArr = [
                                ...responseDiffPolygonsArr,
                                maskDiffResponse,
                            ];

                            console.log('COMPLETELY CONTAINS.');

                            // console.log(
                            //     'DOESNT COMPLETELY CONTAIN INNER POLYGON',
                            //     i,
                            //     j,
                            // );

                            // let tempDiffResponse = turf.difference(
                            //     prevPolygon,
                            //     response,
                            // );

                            // if (!tempDiffResponse) {
                            //     throw new Error('Break on inner difference');
                            // }

                            // // Flatten multipolygon if it is.
                            // if (getType(tempDiffResponse) === 'MultiPolygon') {
                            //     const multiConst =
                            //         tempDiffResponse as turf.helpers.Feature<turf.helpers.MultiPolygon>;

                            //     responseDiffPolygonsArr = [
                            //         ...responseDiffPolygonsArr,
                            //         ...multiConst.geometry.coordinates.map(p =>
                            //             turf.polygon(p),
                            //         ),
                            //     ];
                            // } else {
                            //     const polyConst =
                            //         tempDiffResponse as turf.helpers.Feature<turf.helpers.Polygon>;

                            //     responseDiffPolygonsArr = [
                            //         ...responseDiffPolygonsArr,
                            //         polyConst,
                            //     ];
                            // }
                        }

                        difference = turf.multiPolygon(
                            responseDiffPolygonsArr.map(
                                s => s.geometry.coordinates,
                            ),
                        );
                    }
                }
            }

            if (!difference) {
                throw new Error('Error in removing differences');
            }

            if (difference) {
                if (getType(difference) === 'MultiPolygon') {
                    const multi =
                        difference as turf.helpers.Feature<turf.helpers.MultiPolygon>;

                    const response = multi.geometry.coordinates.map(
                        firstLayer => {
                            return firstLayer.map(secondLayer => {
                                return secondLayer.map(thirdLayer => {
                                    return {
                                        latitude: thirdLayer[1],
                                        longitude: thirdLayer[0],
                                    };
                                });
                            });
                        },
                    );

                    return response;
                } else if (getType(difference) === 'Polygon') {
                    const poly =
                        difference as turf.helpers.Feature<turf.helpers.Polygon>;

                    const response = [
                        poly.geometry.coordinates.map(firstLayer => {
                            return firstLayer.map(secondLayer => {
                                return {
                                    latitude: secondLayer[1],
                                    longitude: secondLayer[0],
                                };
                            });
                        }),
                    ];

                    return response;
                } else {
                    throw new Error('Unrecognised poly');
                }
            } else {
                throw new Error('No poly');
            }
        } catch (err) {
            console.warn('difference:', err);
            return [];
        }
    }, [currentSelected, previouslyFetched]);

    return (
        <>
            {previouslySelectedLatLngPolygon.map((latLngArr, i) =>
                latLngArr.map((latLng, j) => (
                    <Polygon
                        coordinates={latLng}
                        key={i * j}
                        fillColor="rgba(0, 0, 255, 0.4)"
                    />
                )),
            )}
            {currentSelectedLatLngPolygon.map((latLngArr, i) =>
                latLngArr.map((latLng, j) => (
                    <Polygon
                        coordinates={latLng}
                        key={i * j}
                        fillColor="rgba(255, 0, 0, 0.4)"
                    />
                )),
            )}
            {differenceLatLngPolygon.map((latLngArr, i) =>
                latLngArr.map((latLng, j) => (
                    <Polygon
                        coordinates={latLng}
                        key={i * j}
                        fillColor="rgba(0, 255, 0, 0.8)"
                    />
                )),
            )}
        </>
    );
}
