import React, { useEffect, useMemo, useRef, useState } from 'react';

import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import MapStyle from '../../json/map_style.json';
import { Keyboard, StyleSheet, View } from 'react-native';
import { /*useAppDispatch,*/ useAppSelector } from '@/store/hooks';
import DebugPolygons from './DebugPolygons';
import { parseLocation } from '@/services';
import { DiscoveredPub } from '@/types';
import BottomSheet from '@gorhom/bottom-sheet';

const ANIMATE_DELTA = 0.0075;
const INITIAL_DELTA = 0.01;
export default function HomeMap() {
    const [location, setLocation] = useState<
        Location.LocationObject | undefined
    >(undefined);
    const MapRef = useRef<MapView>(null);

    const [hasLoaded, setHasLoaded] = useState(false);

    // const dispatch = useAppDispatch();
    const [selectedPub, setSelectedPub] = useState<DiscoveredPub | undefined>();
    const pubs = useAppSelector(state => state.explore.pubs);

    const bottomSheetRef = useRef<BottomSheet>(null);

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

    // const buildBoundingBox = (region: Region) => {
    //     return {
    //         minLat:
    //             region.latitude -
    //             region.latitudeDelta / 2 +
    //             region.latitudeDelta * 0.01,
    //         minLong:
    //             region.longitude -
    //             region.longitudeDelta / 2 +
    //             region.longitudeDelta * 0.01,
    //         maxLat:
    //             region.latitude +
    //             region.latitudeDelta / 2 +
    //             region.latitudeDelta * 0.01,
    //         maxLong:
    //             region.longitude +
    //             region.longitudeDelta / 2 +
    //             region.longitudeDelta * 0.01,
    //     };
    // };

    // const fetchPubs = (region: Region) => {
    //     dispatch(fetchMapPubs(buildBoundingBox(region)));
    // };

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
        Keyboard.dismiss();
    };

    const mapDragFinished = (region: Region) => {
        if (location !== undefined && !hasLoaded) {
            // fetchPubs(region);
            console.log('region', region);
        } else {
            setHasLoaded(true);
        }
    };

    const selectPub = (pub: DiscoveredPub) => {
        setSelectedPub(pub);
    };

    return (
        <>
            <MapView
                provider="google"
                ref={MapRef}
                showsUserLocation={true}
                showsMyLocationButton={false}
                style={styles.map}
                onPanDrag={panDrag}
                customMapStyle={MapStyle}
                mapPadding={{ bottom: 100, top: 0, right: 0, left: 0 }}
                onRegionChangeComplete={mapDragFinished}
                initialRegion={initialRegion}>
                {pubs.map(pub => {
                    const pubLocation = parseLocation(pub.location);

                    if (pubLocation) {
                        return (
                            <Marker
                                onPress={() => selectPub(pub)}
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
            <BottomSheet
                snapPoints={['20%', '100%']}
                index={0}
                ref={bottomSheetRef}
                backgroundStyle={styles.bottomSheetBackground}
                animateOnMount={true}>
                <View />
            </BottomSheet>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bottomSheetBackground: {
        backgroundColor: 'rgb(242, 242, 242)',
    },
});
