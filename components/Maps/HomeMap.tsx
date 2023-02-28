import React, { RefObject, useEffect, useMemo, useRef, useState } from 'react';

import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import MapStyle from '../../json/map_style.json';
import { Keyboard, StyleSheet } from 'react-native';
import { setPub } from '@/store/slices/pub';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import BottomSheet from '@gorhom/bottom-sheet';
import { fetchMapPubs } from '@/store/slices/map';
import DebugPolygons from './DebugPolygons';
import { parseLocation } from '@/services';

const ANIMATE_DELTA = 0.0075;
const INITIAL_DELTA = 0.01;

type HomeMapProps = {
    bottomPadding: number;
    bottomSheetRef: RefObject<BottomSheet>;
};

export default function HomeMap({
    bottomPadding,
    bottomSheetRef,
}: HomeMapProps) {
    const [location, setLocation] = useState<
        Location.LocationObject | undefined
    >(undefined);
    const MapRef = useRef<MapView>(null);

    const [hasLoaded, setHasLoaded] = useState(false);

    const dispatch = useAppDispatch();
    const selectedPub = useAppSelector(state => state.pub.selectedPub);
    const pubs = useAppSelector(state => state.map.pubs);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                // TODO: Error.
                return;
            }

            let l = await Location.getCurrentPositionAsync();
            setLocation(l);
        })();
    }, []);

    const selectedPubLocation = useMemo(() => {
        if (!selectedPub?.location) {
            return null;
        }

        try {
            return parseLocation(selectedPub.location);
        } catch (err) {
            console.warn(err);
            return null;
        }
    }, [selectedPub]);

    const buildBoundingBox = (region: Region) => {
        return {
            minLat:
                region.latitude -
                region.latitudeDelta / 2 +
                region.latitudeDelta * 0.01,
            minLong:
                region.longitude -
                region.longitudeDelta / 2 +
                region.longitudeDelta * 0.01,
            maxLat:
                region.latitude +
                region.latitudeDelta / 2 +
                region.latitudeDelta * 0.01,
            maxLong:
                region.longitude +
                region.longitudeDelta / 2 +
                region.longitudeDelta * 0.01,
        };
    };

    const fetchPubs = (region: Region) => {
        dispatch(fetchMapPubs(buildBoundingBox(region)));
    };

    const initialRegion = useMemo(() => {
        return location
            ? {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: INITIAL_DELTA,
                  longitudeDelta: INITIAL_DELTA,
              }
            : {
                  latitude: 51.553064,
                  longitude: -0.056349,
                  latitudeDelta: INITIAL_DELTA,
                  longitudeDelta: INITIAL_DELTA,
              };
    }, [location]);

    useEffect(() => {
        if (
            selectedPubLocation &&
            selectedPubLocation.coordinates &&
            MapRef &&
            MapRef.current
        ) {
            MapRef.current.animateToRegion({
                latitude:
                    selectedPubLocation.coordinates[1] - 0.15 * ANIMATE_DELTA,
                longitude: selectedPubLocation.coordinates[0],
                latitudeDelta: ANIMATE_DELTA,
                longitudeDelta: ANIMATE_DELTA,
            });
        }
    }, [selectedPubLocation, MapRef]);

    const panDrag = () => {
        if (bottomSheetRef && bottomSheetRef.current) {
            console.log('COLLAPSE 123');
            bottomSheetRef.current.collapse();
        }

        Keyboard.dismiss();
    };

    const mapDragFinished = (region: Region) => {
        if (location !== undefined && !hasLoaded) {
            fetchPubs(region);
        } else {
            setHasLoaded(true);
        }
    };

    return (
        <MapView
            provider="google"
            ref={MapRef}
            showsUserLocation={true}
            style={styles.map}
            onPanDrag={panDrag}
            customMapStyle={MapStyle}
            mapPadding={{ bottom: bottomPadding, top: 0, right: 0, left: 0 }}
            onRegionChangeComplete={mapDragFinished}
            initialRegion={initialRegion}>
            {pubs.map(pub => {
                const pubLocation = parseLocation(pub.location);

                if (pubLocation) {
                    return (
                        <Marker
                            onPress={() =>
                                dispatch(setPub({ pub, reference: 'map' }))
                            }
                            key={pub.id}
                            coordinate={{
                                latitude: pubLocation.coordinates[1],
                                longitude: pubLocation.coordinates[0],
                            }}
                            title={pub.name}
                        />
                    );
                } else {
                    return undefined;
                }
            })}
            <DebugPolygons />
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
