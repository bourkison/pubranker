import { WITH_POLYGONS } from '@/constants';
import { getType } from '@turf/turf';
import * as turf from '@turf/turf';
import React, { useMemo } from 'react';
import { Geojson, Polygon } from 'react-native-maps';
import { hasFetchedPreviously } from '@/services/geo';
import { useSharedMapContext } from '@/context/mapContext';

export default function DebugPolygons() {
    const { previouslyFetchedPolygon, currentlySelectedPolygon } =
        useSharedMapContext();

    const previouslySelectedLatLngPolygon = useMemo(() => {
        if (!WITH_POLYGONS) {
            return [];
        }

        try {
            if (previouslyFetchedPolygon) {
                if (getType(previouslyFetchedPolygon) === 'MultiPolygon') {
                    const multi =
                        previouslyFetchedPolygon as turf.helpers.Feature<turf.helpers.MultiPolygon>;

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
                } else if (getType(previouslyFetchedPolygon) === 'Polygon') {
                    const poly =
                        previouslyFetchedPolygon as turf.helpers.Feature<turf.helpers.Polygon>;

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
    }, [previouslyFetchedPolygon]);

    const currentSelectedLatLngPolygon = useMemo(() => {
        if (!WITH_POLYGONS) {
            return [];
        }

        try {
            if (!currentlySelectedPolygon) {
                throw new Error('No current selecteds');
            }

            const poly =
                currentlySelectedPolygon as turf.helpers.Feature<turf.helpers.Polygon>;

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
    }, [currentlySelectedPolygon]);

    const differenceGeoJson = useMemo(() => {
        if (!WITH_POLYGONS) {
            return null;
        }

        const g = hasFetchedPreviously(
            currentlySelectedPolygon,
            previouslyFetchedPolygon,
        );

        if (!g) {
            return null;
        }

        return turf.featureCollection([g]);
    }, [currentlySelectedPolygon, previouslyFetchedPolygon]);

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
