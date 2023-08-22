import React, { useEffect, useMemo, useRef, useState } from 'react';

import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import MapStyle from '@/json/map_style.json';
import { Keyboard, StyleSheet, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import DebugPolygons from './DebugPolygons';
import { parseLocation } from '@/services';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetPubList from '@/components/Pubs/BottomSheetPubList';
import { selectPub } from '@/store/slices/map';
import SelectedPub from './SelectedPub';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { PubSchema } from '@/types';

const ANIMATE_DELTA = 0.0075;
const INITIAL_DELTA = 0.01;

export default function HomeMap() {
    const [location, setLocation] = useState<
        Location.LocationObject | undefined
    >(undefined);
    const MapRef = useRef<MapView>(null);

    const [hasLoaded, setHasLoaded] = useState(false);
    const [bottomMapPadding, setBottomMapPadding] = useState(0);

    const selectedPub = useAppSelector(state => state.map.selected);
    const pubs = useAppSelector(state => state.explore.pubs);

    const bottomBarHeight = useBottomTabBarHeight();

    const dispatch = useAppDispatch();

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

    const snapPoints = useMemo(() => ['10%', '35%', '100%'], []);

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

    const pubSelectedOnMap = (pub: PubSchema) => {
        const pubLocation = parseLocation(pub.location);

        MapRef.current?.animateToRegion({
            latitude: pubLocation.coordinates[1] - 0.15 * ANIMATE_DELTA,
            longitude: pubLocation.coordinates[0],
            latitudeDelta: ANIMATE_DELTA,
            longitudeDelta: ANIMATE_DELTA,
        });

        dispatch(selectPub(pub));
        bottomSheetRef.current?.collapse();
    };

    return (
        <>
            <MapView
                provider="google"
                ref={MapRef}
                showsUserLocation={true}
                showsMyLocationButton={false}
                onLayout={e => {
                    setBottomMapPadding(
                        e.nativeEvent.layout.height *
                            (parseFloat(snapPoints[0]) / 100),
                    );
                }}
                style={[styles.map, { marginBottom: bottomBarHeight }]}
                onPanDrag={panDrag}
                customMapStyle={MapStyle}
                mapPadding={{
                    bottom: bottomMapPadding,
                    top: 0,
                    right: 0,
                    left: 0,
                }}
                onRegionChangeComplete={mapDragFinished}
                initialRegion={initialRegion}>
                {pubs.map(pub => {
                    const pubLocation = parseLocation(pub.location);

                    if (pubLocation) {
                        return (
                            <Marker
                                onPress={() => pubSelectedOnMap(pub)}
                                key={pub.id}
                                coordinate={{
                                    latitude: pubLocation.coordinates[1],
                                    longitude: pubLocation.coordinates[0],
                                }}
                            />
                        );
                    } else {
                        return undefined;
                    }
                })}
                <DebugPolygons />
            </MapView>
            {selectedPub !== undefined ? (
                <View
                    style={[
                        styles.selectedPubContainer,
                        { marginBottom: bottomMapPadding + bottomBarHeight },
                    ]}>
                    <SelectedPub pub={selectedPub} />
                </View>
            ) : undefined}
            <BottomSheet
                snapPoints={snapPoints}
                index={1}
                bottomInset={bottomBarHeight}
                ref={bottomSheetRef}
                backgroundStyle={styles.bottomSheetBackground}
                animateOnMount={true}
                onChange={index => {
                    // Deselect pub if user expands bottom sheet
                    if (selectedPub && index !== 0) {
                        dispatch(selectPub(undefined));
                    }
                }}>
                <View style={styles.listContainer}>
                    <BottomSheetPubList pubs={pubs} />
                </View>
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
    selectedPubContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
        paddingHorizontal: 30,
    },
    listContainer: { flex: 1 },
});
