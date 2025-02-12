import React, { useCallback, useState } from 'react';
import { MapContext, MapPub } from '@/context/mapContext';
import { Feature, MultiPolygon, point, polygon, Polygon } from '@turf/helpers';
import {
    convertBoxToCoordinates,
    hasFetchedPreviously,
    joinPolygons,
} from '@/services/geo';
import { BoundingBox } from '@/types';
import * as Location from 'expo-location';
import { supabase } from '@/services/supabase';
import { applyFilters } from '@/services';
import { useAppSelector } from '@/store/hooks';
import { MAX_WITHIN_RANGE } from '@/constants';

type MapProviderProps = {
    children: JSX.Element;
};

export default function MapProvider({ children }: MapProviderProps) {
    const [fetchIncrementor, setFetchIncrementor] = useState(0); // Debugger to see how often we fetch.

    const [mapPubs, setMapPubs] = useState<MapPub[]>([]);
    const [selectedMapPub, setSelectedMapPub] = useState<MapPub | undefined>();
    const [previouslyFetchedPolygon, setPreviouslyFetchedPolygon] =
        useState<Feature<MultiPolygon | Polygon> | null>(null);
    const [currentlySelectedPolygon, setCurrentlySelectedPolygon] =
        useState<Feature<Polygon> | null>(null);

    const filters = useAppSelector(state => state.explore.filters);
    const withinRange = useAppSelector(state => state.explore.withinRange);
    const overallRating = useAppSelector(state => state.explore.overallRating);

    const fetchMapPubs = useCallback(
        async (boundingBox: BoundingBox) => {
            const currentPolygon = polygon([
                convertBoxToCoordinates(boundingBox),
            ]);

            // Bail out if we're completely within previously fetched
            // (hence there's no need to fetch)
            const geojson = hasFetchedPreviously(
                currentPolygon,
                previouslyFetchedPolygon,
            );

            if (!geojson) {
                return;
            }

            console.log('fetch count', fetchIncrementor);
            setFetchIncrementor(fetchIncrementor + 1);

            // Haven't fetched previously, hence we can add what we previously
            // Fetched (which is now currently in current), to our previouslyFetchedPolygon polygon.
            if (currentlySelectedPolygon) {
                setPreviouslyFetchedPolygon(
                    joinPolygons(
                        currentlySelectedPolygon,
                        previouslyFetchedPolygon,
                    ),
                );
            }

            // Set currentlySelectedPolygon for our next search.
            setCurrentlySelectedPolygon(currentPolygon);

            const location = await Location.getCurrentPositionAsync();

            let query = supabase.rpc('get_pubs_in_polygon', {
                geojson: JSON.stringify(geojson.geometry),
                dist_lat: location.coords.latitude,
                dist_long: location.coords.longitude,
            });

            // Apply all filters except searchText as we
            // Don't want that to apply to the map.
            query = applyFilters(query, filters, '');

            if (withinRange < MAX_WITHIN_RANGE) {
                query = query.lte('dist_meters', withinRange);
            }

            if (overallRating > 0) {
                query = query.gte('rating', overallRating);
            }

            // Fetch the pubs.
            const { data, error } = await query.select(
                'id, name, location, address, primary_photo, dist_meters, rating, num_reviews',
            );

            if (error) {
                console.error('Error pulling map pubs', error);
                return;
            }

            const mappedData: MapPub[] = data
                .filter(d => {
                    if (!d.location) {
                        return false;
                    }

                    if (!point(JSON.parse(d.location)?.coordinates)?.geometry) {
                        return false;
                    }

                    return true;
                })
                .map(d => ({
                    id: d.id,
                    name: d.name,
                    address: d.address,
                    primary_photo: d.primary_photo,
                    num_reviews: d.num_reviews,
                    rating: d.rating,
                    dist_meters: d.dist_meters,
                    location: point(JSON.parse(d.location || '').coordinates)
                        .geometry,
                }));

            // Only add new pubs.
            let newPubs = mapPubs.slice();

            mappedData.forEach(d => {
                if (newPubs.findIndex(p => p.id === d.id) === -1) {
                    newPubs.push(d);
                }
            });

            console.log('Pubs', newPubs.length);

            setMapPubs(newPubs);
        },
        [
            currentlySelectedPolygon,
            filters,
            overallRating,
            mapPubs,
            withinRange,
            previouslyFetchedPolygon,
            fetchIncrementor,
        ],
    );

    const selectMapPub = useCallback(
        (id: number) => {
            const p = mapPubs.find(pub => pub.id === id);

            if (p) {
                setSelectedMapPub(p);
            }
        },
        [mapPubs],
    );

    const deselectMapPub = useCallback(() => {
        setSelectedMapPub(undefined);
    }, []);

    const resetMapPubs = useCallback(() => {
        setMapPubs([]);
        setPreviouslyFetchedPolygon(null);
        setCurrentlySelectedPolygon(null);
        setSelectedMapPub(undefined);
    }, []);

    return (
        <MapContext.Provider
            value={{
                currentlySelectedPolygon,
                previouslyFetchedPolygon,
                mapPubs,
                selectedMapPub,
                selectMapPub,
                fetchMapPubs,
                deselectMapPub,
                resetMapPubs,
            }}>
            {children}
        </MapContext.Provider>
    );
}
