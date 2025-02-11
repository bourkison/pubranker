import { BoundingBox } from '@/types';
import { Feature, MultiPolygon, Point, Polygon } from '@turf/helpers';
import { createContext, useContext } from 'react';

export type MapPub = {
    id: number;
    name: string;
    address: string;
    primary_photo: string;
    dist_meters: number;
    location: Point;
    num_reviews: number;
    rating: number;
};

type MapContextType = {
    currentlySelectedPolygon: Feature<Polygon> | null;
    previouslyFetchedPolygon: Feature<MultiPolygon | Polygon> | null;
    mapPubs: MapPub[];
    selectedMapPub: MapPub | undefined;
    fetchMapPubs: (boundingBox: BoundingBox) => Promise<void>;
    selectMapPub: (id: number) => void;
    deselectMapPub: () => void;
    resetMapPubs: () => void;
};

export const MapContext = createContext<MapContextType | null>(null);

export const useSharedMapContext = () => {
    const context = useContext(MapContext);

    if (!context) {
        throw "'useSharedMapContext' must be used within MapContext";
    }

    return context;
};
