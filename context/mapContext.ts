import { BoundingBox } from '@/types';
import { Tables } from '@/types/schema';
import { Feature, MultiPolygon, Point, Polygon } from '@turf/helpers';
import { createContext, useContext } from 'react';

export type MapPubs = {
    id: number;
    name: string;
    address: string;
    primary_photo: string;
    dist_meters: number;
    location: Point;
};

type MapContextType = {
    pubs: MapPubs[];
    selected: MapPubs | undefined;
    isLoadingSelected: boolean;
    previouslyFetched: Feature<MultiPolygon | Polygon> | null;
    currentlySelected: Feature<Polygon> | null;
    fetchMapPubs: (boundingBox: BoundingBox) => Promise<void>;
};

export const MapContext = createContext<MapContextType | null>(null);

export const useSharedMapContext = () => {
    const context = useContext(MapContext);

    if (!context) {
        throw "'useSharedMapContext' must be used within MapContext";
    }

    return context;
};
