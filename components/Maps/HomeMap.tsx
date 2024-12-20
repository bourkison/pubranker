import React, { useEffect, useMemo, useRef, useState } from 'react';

import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import MapStyle from '@/json/map_style.json';
import { StyleSheet, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import DebugPolygons from './DebugPolygons';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetPubList from '@/components/Pubs/PubList';
import { deselectPub, fetchMapPubs, selectPub } from '@/store/slices/map';
import SelectedPub from './SelectedPub';
import { useSharedExploreContext } from '@/context/exploreContext';
import MapMarkers from './MapMarkers';
import _ from 'lodash';
import { Point } from '@turf/helpers';

const ANIMATE_DELTA = 0.0075;
const INITIAL_DELTA = 0.01;

export default function HomeMap() {
    const [location, setLocation] = useState<
        Location.LocationObject | undefined
    >(undefined);
    const MapRef = useRef<MapView>(null);

    const [bottomMapPadding, setBottomMapPadding] = useState(0);

    const selectedPub = useAppSelector(state => state.map.selected);
    const mapPubs = useAppSelector(state => state.map.pubs);
    const explorePubs = useAppSelector(state => state.explore.pubs);

    const dispatch = useAppDispatch();

    const { filterBarHeight, mapBottomSheetAnimatedValue } =
        useSharedExploreContext();

    const bottomSheetRef = useRef<BottomSheet>(null);

    useEffect(() => {
        (async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                // TODO: Error.
                return;
            }

            const l = await Location.getCurrentPositionAsync();
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

    const [region, setRegion] = useState<Region>(initialRegion);

    const throttledSetRegion = useMemo(
        () =>
            _.throttle((r: Region) => setRegion(r), 500, {
                leading: false,
                trailing: true,
            }),
        [setRegion],
    );

    const regionChange = (r: Region) => {
        throttledSetRegion(r);
        // setRegion(r);
    };

    const pubSelectedOnMap = (pub: { id: number; location: Point }) => {
        MapRef.current?.animateToRegion({
            latitude: pub.location.coordinates[1] - 0.15 * ANIMATE_DELTA,
            longitude: pub.location.coordinates[0],
            latitudeDelta: ANIMATE_DELTA,
            longitudeDelta: ANIMATE_DELTA,
        });

        dispatch(selectPub(pub.id));
        bottomSheetRef.current?.collapse();
    };

    const groupSelectedOnMap = (
        locations: { latitude: number; longitude: number }[],
    ) => {
        MapRef.current?.fitToCoordinates(locations, {
            edgePadding: { left: 50, right: 50, top: 200, bottom: 200 },
        });
        bottomSheetRef.current?.collapse();
    };

    // When region changes, get any new pubs that are within this new region.
    useEffect(() => {
        dispatch(
            fetchMapPubs({
                minLat: region.latitude - region.latitudeDelta,
                minLong: region.longitude - region.longitudeDelta,
                maxLat: region.latitude + region.latitudeDelta,
                maxLong: region.longitude + region.longitudeDelta,
            }),
        );
    }, [region, dispatch]);

    return (
        <>
            <MapView
                ref={MapRef}
                showsUserLocation={true}
                showsMyLocationButton={false}
                onLayout={e => {
                    setBottomMapPadding(
                        e.nativeEvent.layout.height *
                            (parseFloat(snapPoints[0]) / 100),
                    );
                }}
                style={[styles.map]}
                onRegionChange={regionChange}
                customMapStyle={MapStyle}
                mapPadding={{
                    bottom: bottomMapPadding,
                    top: 0,
                    right: 0,
                    left: 0,
                }}
                onRegionChangeComplete={setRegion}
                initialRegion={initialRegion}>
                <MapMarkers
                    region={region}
                    pubs={mapPubs}
                    markerWidth={32}
                    onPubSelect={pubSelectedOnMap}
                    onGroupSelect={groupSelectedOnMap}
                />
                <DebugPolygons />
            </MapView>
            {selectedPub !== undefined ? (
                <View
                    style={[
                        styles.selectedPubContainer,
                        { marginBottom: bottomMapPadding },
                    ]}>
                    <SelectedPub pub={selectedPub} />
                </View>
            ) : undefined}
            <BottomSheet
                snapPoints={snapPoints}
                index={1}
                ref={bottomSheetRef}
                animatedPosition={mapBottomSheetAnimatedValue}
                backgroundStyle={styles.bottomSheetBackground}
                animateOnMount={true}
                topInset={filterBarHeight}
                onChange={index => {
                    // Deselect pub if user expands bottom sheet
                    if (selectedPub && index !== 0) {
                        dispatch(deselectPub());
                    }
                }}>
                <View style={styles.listContainer}>
                    <BottomSheetPubList pubs={explorePubs} />
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
        paddingHorizontal: 30,
    },
    listContainer: { flex: 1 },
});
