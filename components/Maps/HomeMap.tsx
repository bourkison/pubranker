import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Location from 'expo-location';
import MapStyle from '@/json/map_style.json';
import { StyleSheet, View } from 'react-native';
import { useAppSelector } from '@/store/hooks';
// import DebugPolygons from './DebugPolygons';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetPubList from '@/components/Pubs/BottomSheetPubList';
import SelectedPub from './SelectedPub';
import { useSharedExploreContext } from '@/context/exploreContext';
import MapMarkers from '@/components/Maps/MapMarkers';
import { Point } from '@turf/helpers';
import { useSharedMapContext } from '@/context/mapContext';
import { MapView, Camera, LocationPuck } from '@rnmapbox/maps';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';

const ANIMATE_DELTA = 0.0075;

// TODO: Check out rnmapbox
// https://github.com/rnmapbox/maps

export default function HomeMap() {
    const [location, setLocation] = useState<
        Location.LocationObject | undefined
    >(undefined);

    const initialRegion = useMemo<Position>(() => {
        return location
            ? [location.coords.longitude, location.coords.latitude]
            : [-0.056349, 51.553064];
    }, [location]);

    const MapRef = useRef<MapView>(null);
    const CameraRef = useRef<Camera>(null);
    const [region, setRegion] = useState<Position>(initialRegion);
    const [mapBounds, setMapBounds] = useState<[Position, Position]>();

    const [bottomMapPadding, setBottomMapPadding] = useState(0);
    const explorePubs = useAppSelector(state => state.explore.pubs);

    const { filterBarHeight, mapBottomSheetAnimatedValue } =
        useSharedExploreContext();

    const bottomSheetRef = useRef<BottomSheet>(null);

    const {
        fetchMapPubs,
        mapPubs,
        selectMapPub,
        deselectMapPub,
        selectedMapPub,
    } = useSharedMapContext();

    useEffect(() => {
        (async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                // TODO: Error.
                console.error('NO PERMISSION');
                return;
            }

            const l = await Location.getCurrentPositionAsync();
            setLocation(l);
            CameraRef.current?.setCamera({
                centerCoordinate: [l.coords.longitude, l.coords.latitude],
                animationDuration: 0,
                zoomLevel: 14,
                animationMode: 'none',
            });

            const bounds = await MapRef.current?.getVisibleBounds();
            setMapBounds(bounds);

            console.log('bounds', bounds);
        })();
    }, []);

    const snapPoints = useMemo(() => ['10%', '35%', '100%'], []);

    const pubSelectedOnMap = (pub: { id: number; location: Point }) => {
        CameraRef.current?.setCamera({
            centerCoordinate: pub.location.coordinates,
            zoomLevel: 15,
        });

        selectMapPub(pub.id);
        bottomSheetRef.current?.collapse();
    };

    const groupSelectedOnMap = (locations: Positions[]) => {
        // CameraRef.current?.fitBounds(locations);
        // MapRef.current?.fitToCoordinates(locations, {
        //     edgePadding: { left: 50, right: 50, top: 200, bottom: 200 },
        // });
        bottomSheetRef.current?.collapse();
    };

    // When region changes, get any new pubs that are within this new region.
    useEffect(() => {
        if (!mapBounds || !mapBounds[0] || !mapBounds[1]) {
            return;
        }

        console.log('FETCHING PUBS', mapPubs);

        fetchMapPubs({
            minLat: mapBounds[0][1],
            minLong: mapBounds[0][0],
            maxLat: mapBounds[1][1],
            maxLong: mapBounds[1][0],
        });
    }, [mapBounds, fetchMapPubs, mapPubs]);

    return (
        <>
            <MapView
                ref={MapRef}
                style={styles.map}
                regionDidChangeDebounceTime={200}
                scaleBarEnabled={false}
                logoPosition={{ bottom: bottomMapPadding - 10, left: 10 }}
                attributionPosition={{
                    bottom: bottomMapPadding - 10,
                    right: 0,
                }}
                onRegionDidChange={({ properties }) =>
                    setMapBounds([
                        properties.visibleBounds[0],
                        properties.visibleBounds[1],
                    ])
                }
                onLayout={({
                    nativeEvent: {
                        layout: { height },
                    },
                }) =>
                    setBottomMapPadding(
                        height * (parseFloat(snapPoints[0]) / 100),
                    )
                }
                styleJSON={JSON.stringify(MapStyle)}>
                <Camera ref={CameraRef} />
                <LocationPuck />
                <MapMarkers
                    mapBounds={mapBounds || []}
                    pubs={mapPubs}
                    markerWidth={32}
                    onPubSelect={pubSelectedOnMap}
                    onGroupSelect={groupSelectedOnMap}
                />
            </MapView>

            {/* <MapView
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
            </MapView> */}
            {selectedMapPub !== undefined ? (
                <View
                    style={[
                        styles.selectedPubContainer,
                        { marginBottom: bottomMapPadding },
                    ]}>
                    <SelectedPub pub={selectedMapPub} />
                </View>
            ) : undefined}
            <BottomSheet
                snapPoints={snapPoints}
                index={1}
                ref={bottomSheetRef}
                animatedPosition={mapBottomSheetAnimatedValue}
                backgroundStyle={styles.bottomSheetBackground}
                animateOnMount={true}
                containerStyle={styles.bottomSheetContainer}
                topInset={filterBarHeight}
                onChange={index => {
                    // Deselect pub if user expands bottom sheet
                    if (selectedMapPub && index !== 0) {
                        deselectMapPub();
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
    bottomSheetContainer: {
        zIndex: 10,
    },
});
