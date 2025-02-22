import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import * as Location from 'expo-location';
import MapStyle from '@/json/map_style.json';
import { StyleSheet, View } from 'react-native';
import { useAppSelector } from '@/store/hooks';
// import DebugPolygons from './DebugPolygons';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetPubList from '@/components/Pubs/BottomSheetPubList';
import SelectedPub from './SelectedPub';
import { useSharedExploreContext } from '@/context/exploreContext';
import MapMarkers, { MapPubType } from '@/components/Maps/MapMarkers';
import { Feature, MultiPolygon, Point, Polygon, polygon } from '@turf/helpers';
import { useSharedMapContext } from '@/context/mapContext';
import { MapView, Camera, LocationPuck } from '@rnmapbox/maps';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import { convertBoxToCoordinates, getMinMaxLatLong } from '@/services/geo';
import { booleanPointInPolygon, distance, ellipse, union } from '@turf/turf';

const MAX_CAMERA_ZOOM = 16;
const MIN_CAMERA_ZOOM = 11;

export default function HomeMap() {
    const MapRef = useRef<MapView>(null);
    const CameraRef = useRef<Camera>(null);
    const [mapBounds, setMapBounds] = useState<{
        ne: Position;
        sw: Position;
    }>();
    const [cameraZoom, setCameraZoom] = useState(0);

    const [mapHeight, setMapHeight] = useState(0);
    const [mapWidth, setMapWidth] = useState(0);
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

    const snapPoints = useMemo(() => ['10%', '35%', '100%'], []);

    const bottomMapPadding = useMemo(
        () => mapHeight * (parseFloat(snapPoints[0]) / 100),
        [mapHeight, snapPoints],
    );

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

            CameraRef.current?.setCamera({
                centerCoordinate: [l.coords.longitude, l.coords.latitude],
                animationDuration: 0,
                zoomLevel: 14,
                animationMode: 'none',
            });

            const bounds = await MapRef.current?.getVisibleBounds();

            if (!bounds) {
                return;
            }

            setMapBounds({ ne: bounds[0], sw: bounds[1] });

            console.log('bounds', bounds);
        })();
    }, []);

    const markers = useMemo<Array<MapPubType | MapPubType[]>>(() => {
        if (!mapBounds) {
            return [];
        }

        // TODO: Potentially add a bit extra padding on the outside to include other pubs just outside viewport.
        const screenPolygon = polygon([
            convertBoxToCoordinates({
                minLat: mapBounds.ne[1],
                minLong: mapBounds.ne[0],
                maxLat: mapBounds.sw[1],
                maxLong: mapBounds.sw[0],
            }),
        ]);

        const pubsWithinScreen = mapPubs.filter(pub => {
            return booleanPointInPolygon(pub.location, screenPolygon);
        });

        // If we're max zoomed, don't do any grouping.
        if (cameraZoom >= MAX_CAMERA_ZOOM) {
            return pubsWithinScreen;
        }

        const ELLIPSE_WIDTH_PIXELS = 20;
        const ELLIPSE_HEIGHT_PIXELS = 50;
        const MAX_GROUPING_DISTANCE_PIXELS = 100;

        // Get the total width of the screen in degrees, then calculate per pixel width.
        const screenWidthDeg = Math.abs(mapBounds.sw[1] - mapBounds.ne[1]);
        const degWidthPerPixel = screenWidthDeg / mapWidth;
        const ELLIPSE_WIDTH_DEG = ELLIPSE_WIDTH_PIXELS * degWidthPerPixel;

        // Do the same for height.
        const screenHeightDeg = Math.abs(mapBounds.ne[0] - mapBounds.sw[0]);
        const degHeightPerPixel = screenHeightDeg / mapHeight;
        const ELLIPSE_HEIGHT_DEG = ELLIPSE_HEIGHT_PIXELS * degHeightPerPixel;

        // Average out the 2 and get our max distance degrees.
        const avgDegPerPixel = (degWidthPerPixel + degHeightPerPixel) / 2;
        const MAX_GROUPING_DISTANCE_DEG =
            avgDegPerPixel * MAX_GROUPING_DISTANCE_PIXELS;

        // This is taking an input of either 1 polygon (initial ellipsis) or multi polygon (merged ellipsis)
        // As well as the index to check from (to avoid checking over previously checked pubs).
        const checkCollision = (
            inputPolygon: Feature<MultiPolygon | Polygon>,
            startIndex: number,
            initialPoint: Point,
        ): { point: Point; index: number } | undefined => {
            for (let i = startIndex; i < pubsWithinScreen.length; i++) {
                // Don't check for collisions for the selectedPub
                if (pubsWithinScreen[i].id === selectedMapPub?.id) {
                    continue;
                }

                // Don't check for collisions if this pub is further than MAX_DISTANCE.
                if (
                    distance(initialPoint, pubsWithinScreen[i].location, {
                        units: 'degrees',
                    }) > MAX_GROUPING_DISTANCE_DEG
                ) {
                    continue;
                }

                // Check for collision.
                if (
                    booleanPointInPolygon(
                        pubsWithinScreen[i].location,
                        inputPolygon,
                    )
                ) {
                    return { point: pubsWithinScreen[i].location, index: i };
                }
            }
        };

        let outputArray: Array<MapPubType | MapPubType[]> = [];

        for (let i = 0; i < pubsWithinScreen.length; i++) {
            const pub = pubsWithinScreen[i];

            // First step, build containing ellipse around this pub that we will check for collisions with.
            // This may later become a union if other pubs are colliding.
            let ellipsePolygon: Feature<MultiPolygon | Polygon> = ellipse(
                pub.location,
                ELLIPSE_WIDTH_DEG,
                ELLIPSE_HEIGHT_DEG,
                { units: 'degrees' },
            );

            // Now loop through all other pubs that we haven't already checked (by setting j to i).
            // Check if collision.
            // If so, add the collision pub to the array.
            let loopOutput = [{ id: pub.id, location: pub.location }];
            let lastCollisionPoint = i + 1;

            while (true) {
                // If we're selected pub, get out of here as we don't want to group.
                if (pub.id === selectedMapPub?.id) {
                    outputArray.push(pub);
                    break;
                }

                const collision = checkCollision(
                    ellipsePolygon,
                    lastCollisionPoint,
                    pub.location,
                );

                if (!collision) {
                    if (loopOutput.length === 1) {
                        // No collisions at all, push pub and not array.
                        outputArray.push(pub);
                    } else {
                        outputArray.push(loopOutput);
                    }

                    break;
                }

                const { point: collisionPoint, index: collisionIndex } =
                    collision;

                // If a collision, create a new ellipse at collision point.
                const collisionEllipse = ellipse(
                    collisionPoint,
                    ELLIPSE_WIDTH_DEG,
                    ELLIPSE_HEIGHT_DEG,
                    { units: 'degrees' },
                );

                // Join the 2 ellipses
                const u = union(ellipsePolygon, collisionEllipse);

                if (!u) {
                    console.warn('Error in polygon union.');
                    continue;
                }

                // Set the ellipse polygon to the union for next search (so it is included for a collision).
                ellipsePolygon = u;

                // Push the collided pub into the loop output array.
                loopOutput.push({
                    id: pubsWithinScreen[collisionIndex].id,
                    location: pubsWithinScreen[collisionIndex].location,
                });

                // Remove the collided pub from pubs within screen, so we are not checking any
                // other collisions on it.
                pubsWithinScreen.splice(collisionIndex, 1);
            }
        }

        return outputArray;
    }, [mapPubs, mapBounds, mapHeight, selectedMapPub, mapWidth, cameraZoom]);

    const pubSelectedOnMap = useCallback(
        (pub: { id: number; location: Point }) => {
            const ZOOM_AMOUNT = 14;

            CameraRef.current?.setCamera({
                centerCoordinate: pub.location.coordinates,
                zoomLevel: Math.max(cameraZoom, ZOOM_AMOUNT),
            });

            selectMapPub(pub.id);
            bottomSheetRef.current?.collapse();
        },
        [selectMapPub, cameraZoom],
    );

    const groupSelectedOnMap = useCallback((locations: Position[]) => {
        const minMaxLatLong = getMinMaxLatLong(locations);

        if (!minMaxLatLong) {
            return;
        }

        CameraRef.current?.fitBounds(
            [minMaxLatLong.minLong, minMaxLatLong.minLat],
            [minMaxLatLong.maxLong, minMaxLatLong.maxLat],
            100,
        );

        bottomSheetRef.current?.collapse();
    }, []);

    // When region changes, get any new pubs that are within this new region.
    useEffect(() => {
        if (!mapBounds) {
            return;
        }

        fetchMapPubs({
            minLat: mapBounds.ne[1],
            minLong: mapBounds.ne[0],
            maxLat: mapBounds.sw[1],
            maxLong: mapBounds.sw[0],
        });
    }, [mapBounds, fetchMapPubs]);

    return (
        <>
            <MapView
                ref={MapRef}
                style={styles.map}
                scaleBarEnabled={false}
                logoPosition={{ bottom: bottomMapPadding - 10, left: 10 }}
                attributionPosition={{
                    bottom: bottomMapPadding - 10,
                    right: 0,
                }}
                regionDidChangeDebounceTime={200}
                onMapIdle={({ properties }) => {
                    setMapBounds(properties.bounds);
                    setCameraZoom(properties.zoom);
                }}
                onLayout={({
                    nativeEvent: {
                        layout: { height, width },
                    },
                }) => {
                    setMapWidth(width);
                    setMapHeight(height);
                }}
                styleJSON={JSON.stringify(MapStyle)}>
                <Camera
                    ref={CameraRef}
                    maxZoomLevel={MAX_CAMERA_ZOOM}
                    minZoomLevel={MIN_CAMERA_ZOOM}
                />
                <LocationPuck />
                <MapMarkers
                    markers={markers}
                    onPubSelect={pubSelectedOnMap}
                    onGroupSelect={groupSelectedOnMap}
                />
            </MapView>
            {selectedMapPub !== undefined && (
                <View
                    style={[
                        styles.selectedPubContainer,
                        { marginBottom: bottomMapPadding },
                    ]}>
                    <SelectedPub pub={selectedMapPub} />
                </View>
            )}
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
