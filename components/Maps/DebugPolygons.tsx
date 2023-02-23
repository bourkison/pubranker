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
                        previouslyFetched as turf.helpers.MultiPolygon;

                    const response = multi.coordinates.map(firstLayer => {
                        return firstLayer.map(secondLayer => {
                            return secondLayer.map(thirdLayer => {
                                return {
                                    latitude: thirdLayer[1],
                                    longitude: thirdLayer[0],
                                };
                            });
                        });
                    });

                    return response;
                } else if (getType(previouslyFetched) === 'Polygon') {
                    const poly = previouslyFetched as turf.helpers.Polygon;

                    const response = [
                        poly.coordinates.map(firstLayer => {
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

            if (currentSelected) {
                if (getType(currentSelected) === 'MultiPolygon') {
                    const multi = currentSelected as turf.helpers.MultiPolygon;

                    const response = multi.coordinates.map(firstLayer => {
                        return firstLayer.map(secondLayer => {
                            return secondLayer.map(thirdLayer => {
                                return {
                                    latitude: thirdLayer[1],
                                    longitude: thirdLayer[0],
                                };
                            });
                        });
                    });

                    return response;
                } else if (getType(currentSelected) === 'Polygon') {
                    const poly = currentSelected as turf.helpers.Polygon;

                    const response = [
                        poly.coordinates.map(firstLayer => {
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

            console.log(
                'BOOLEAN:',
                turf.booleanOverlap(previouslyFetched, currentSelected),
            );

            const difference = turf.difference(
                currentSelected,
                previouslyFetched,
            )?.geometry;

            if (difference) {
                if (getType(difference) === 'MultiPolygon') {
                    const multi = difference as turf.helpers.MultiPolygon;

                    const response = multi.coordinates.map(firstLayer => {
                        return firstLayer.map(secondLayer => {
                            return secondLayer.map(thirdLayer => {
                                return {
                                    latitude: thirdLayer[1],
                                    longitude: thirdLayer[0],
                                };
                            });
                        });
                    });

                    return response;
                } else if (getType(difference) === 'Polygon') {
                    const poly = difference as turf.helpers.Polygon;

                    const response = [
                        poly.coordinates.map(firstLayer => {
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
            // console.warn('difference:', err);
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
