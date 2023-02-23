import { WITH_POLYGONS } from '@/screens/constants';
import { useAppSelector } from '@/store/hooks';
import { getType } from '@turf/turf';
import * as turf from '@turf/turf';
import React, { useMemo } from 'react';
import { Geojson, Polygon } from 'react-native-maps';
import { hasFetchedPreviously } from '@/services/geo';

export default function DebugPolygons() {
    const previouslyFetched = useAppSelector(
        state => state.map.previouslyFetched,
    );
    const currentSelected = useAppSelector(state => state.map.currentSelected);

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

    const differenceGeoJson = useMemo(() => {
        if (!WITH_POLYGONS) {
            return null;
        }

        const g = hasFetchedPreviously(currentSelected, previouslyFetched);

        if (!g) {
            return null;
        }

        return turf.featureCollection([g]);
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
            {differenceGeoJson ? (
                <Geojson
                    // @ts-ignore
                    geojson={differenceGeoJson}
                    fillColor="rgba(0, 255, 0, 0.8)"
                />
            ) : undefined}
        </>
    );
}
