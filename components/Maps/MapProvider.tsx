import React, { useCallback, useState } from 'react';
import { MapContext, MapPubs } from '@/context/mapContext';
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
    const [pubs, setPubs] = useState<MapPubs[]>([]);
    const [selected, setSelected] = useState<MapPubs | undefined>();
    const [isLoadingSelected, setIsLoadingSelected] = useState(false);
    const [previouslyFetched, setPreviouslyFetched] = useState<Feature<
        MultiPolygon | Polygon
    > | null>(null);
    const [currentlySelected, setCurrentlySelected] =
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
                previouslyFetched,
            );

            if (!geojson) {
                return;
            }

            // Haven't fetched previously, hence we can add what we previously
            // Fetched (which is now currently in current), to our previouslyFetched polygon.
            if (currentlySelected) {
                setPreviouslyFetched(
                    joinPolygons(currentlySelected, previouslyFetched),
                );
            }

            // Set currentlySelected for our next search.
            setCurrentlySelected(currentPolygon);

            const location = await Location.getCurrentPositionAsync();

            let query = supabase.rpc('pubs_in_polygon', {
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
                'id, name, location, address, primary_photo, dist_meters',
            );

            if (error) {
                console.error('Error pulling map pubs', error);
                return;
            }

            const mappedData: MapPubs[] = data
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
                    dist_meters: d.dist_meters,
                    location: point(JSON.parse(d.location || '').coordinates)
                        .geometry,
                }));

            // Only add new pubs.
            let newPubs = pubs.slice();

            mappedData.forEach(d => {
                if (newPubs.findIndex(p => p.id === d.id) === -1) {
                    newPubs.push(d);
                }
            });

            setPubs(newPubs);
            console.log('new pubs', newPubs);
        },
        [
            currentlySelected,
            filters,
            overallRating,
            pubs,
            withinRange,
            previouslyFetched,
        ],
    );

    return (
        <MapContext.Provider
            value={{
                pubs,
                selected,
                isLoadingSelected,
                previouslyFetched,
                currentlySelected,
                fetchMapPubs,
            }}>
            {children}
        </MapContext.Provider>
    );
}
