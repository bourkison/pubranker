import { UserRatingsType } from '@/screens/MainNavigator/UserRatings';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    useWindowDimensions,
} from 'react-native';
import { LocationPuck, MapView, MarkerView, Camera } from '@rnmapbox/maps';
import { SECONDARY_COLOR } from '@/constants';
import { getMinMaxLatLong } from '@/services/geo';
import { Ionicons } from '@expo/vector-icons';
import { center, multiPolygon } from '@turf/turf';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/services/supabase';
import RatingsStarViewer from './RatingsStarsViewer';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const NO_IMAGE = require('@/assets/noimage.png');

type RatingsMapProps = {
    ratings: UserRatingsType[];
};

const ASPECT_RATIO = 1.1;

export default function RatingsMap({ ratings }: RatingsMapProps) {
    const [selectedPub, setSelectedPub] = useState<UserRatingsType>();
    const CameraRef = useRef<Camera>(null);

    const { width } = useWindowDimensions();
    const height = useMemo(() => width * ASPECT_RATIO, [width]);

    const navigation = useNavigation();

    useEffect(() => {
        const minMaxMatLong = getMinMaxLatLong(
            ratings.map(r => r.pub.location.coordinates),
        );

        if (!minMaxMatLong) {
            return;
        }

        CameraRef.current?.fitBounds(
            [minMaxMatLong.minLong, minMaxMatLong.minLat],
            [minMaxMatLong.maxLong, minMaxMatLong.maxLat],
            50,
            0,
        );
    }, [ratings]);

    const selectPub = useCallback(
        (index: number) => {
            setSelectedPub(ratings[index]);

            if (!ratings[index]) {
                return;
            }

            CameraRef.current?.setCamera({
                centerCoordinate: ratings[index].pub.location.coordinates,
                zoomLevel: 14,
            });
        },
        [ratings],
    );

    if (ratings.length === 0) {
        return <View />;
    }

    return (
        <View>
            <MapView style={{ width, height }} scaleBarEnabled={false}>
                <Camera
                    ref={CameraRef}
                    minZoomLevel={8}
                    maxZoomLevel={16}
                    centerCoordinate={
                        center(
                            multiPolygon([
                                [ratings.map(r => r.pub.location.coordinates)],
                            ]),
                        ).geometry.coordinates
                    }
                    animationDuration={0}
                    animationMode="none"
                />
                <LocationPuck />
                {ratings.map((rating, index) => (
                    <MarkerView coordinate={rating.pub.location.coordinates}>
                        <Pressable onPress={() => selectPub(index)}>
                            <View style={styles.markerContainer}>
                                <View style={styles.starContainer}>
                                    <Ionicons
                                        name="star"
                                        size={12}
                                        color="#fff"
                                    />
                                </View>
                                <Text style={styles.markerText}>
                                    {(rating.rating / 2).toFixed(1)}
                                </Text>
                            </View>
                        </Pressable>
                    </MarkerView>
                ))}
            </MapView>
            {selectedPub && (
                <Animated.View
                    style={styles.selectedContainer}
                    entering={FadeIn}
                    exiting={FadeOut}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() =>
                            navigation.navigate('PubHome', {
                                screen: 'PubView',
                                params: { pubId: selectedPub.pub.id },
                            })
                        }
                        style={styles.selectedContentContainer}>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={
                                    selectedPub.pub.primary_photo
                                        ? {
                                              uri: supabase.storage
                                                  .from('pubs')
                                                  .getPublicUrl(
                                                      selectedPub.pub
                                                          .primary_photo,
                                                  ).data.publicUrl,
                                          }
                                        : NO_IMAGE
                                }
                            />
                        </View>
                        <View>
                            <Text style={styles.selectedText}>
                                {selectedPub.pub.name}
                            </Text>
                            <View style={styles.starsContainer}>
                                <RatingsStarViewer
                                    amount={selectedPub.rating}
                                    padding={0}
                                    size={12}
                                />
                            </View>
                        </View>
                        <Pressable
                            style={styles.closeContainer}
                            onPress={() => setSelectedPub(undefined)}>
                            <Text style={styles.closeText}>x</Text>
                        </Pressable>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    markerContainer: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: SECONDARY_COLOR,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#FFF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerText: {
        fontSize: 12,
        color: '#FFF',
        fontWeight: '600',
    },
    starContainer: {
        marginRight: 3,
    },
    selectedContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 99,
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: '100%',
    },
    selectedContentContainer: {
        backgroundColor: '#FFF',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        marginRight: 5,
    },
    image: { width: 80, height: 80 },
    selectedText: {
        fontSize: 12,
        fontWeight: '400',
        marginBottom: 3,
    },
    starsContainer: {
        flexDirection: 'row',
    },
    closeContainer: {
        paddingVertical: 0,
        paddingHorizontal: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        position: 'absolute',
        top: 5,
        right: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        color: 'white',
    },
});
