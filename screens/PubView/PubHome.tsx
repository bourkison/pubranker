import React, { useEffect, useMemo, useState } from 'react';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import {
    View,
    Text,
    Image,
    StyleSheet,
    useWindowDimensions,
    Pressable,
} from 'react-native';
import { supabase } from '@/services/supabase';
import { PUB_HOME_IMAGE_ASPECT_RATIO } from '@/constants';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    Extrapolation,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { distanceString, roundToNearest } from '@/services';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import PubTopBar from '@/components/Pubs/PubTopBar';
import PubDescription from '@/components/Pubs/PubView/PubDescription';
import PubFeatures from '@/components/Pubs/PubView/PubFeatures';
import DraughtBeersList from '@/components/Beers/DraughtBeersList';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopTabNavigator from '@/nav/TopTabNavigator';

export default function PubHome({
    route,
}: StackScreenProps<MainNavigatorStackParamList, 'PubView'>) {
    const [headerImageUrl, setHeaderImageUrl] = useState('');

    const { width } = useWindowDimensions();

    useEffect(() => {
        const url = supabase.storage
            .from('pubs')
            .getPublicUrl(route.params.pub.photos[0]);
        setHeaderImageUrl(url.data.publicUrl);
    }, [route.params.pub]);

    const insets = useSafeAreaInsets();

    // We want initial image height to be 4:3, but 1:1 underneath.
    // Render 1:1 but than move the translateY by the difference between heights.
    const initTranslateY = useMemo(() => {
        const fourByThreeHeight = width / PUB_HOME_IMAGE_ASPECT_RATIO;
        return fourByThreeHeight - width;
    }, [width]);

    const sTranslateY = useSharedValue(0);
    const contextY = useSharedValue(0);

    const rContentContainerStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: sTranslateY.value + initTranslateY }],
    }));

    const rOverlayStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: sTranslateY.value + initTranslateY }],
    }));

    const rButtonStyle = useAnimatedStyle(() => {
        const imageHeight = -(width / PUB_HOME_IMAGE_ASPECT_RATIO);
        const crossOverPoint = imageHeight + insets.top + styles.button.height;

        return {
            backgroundColor: interpolateColor(
                sTranslateY.value,
                [crossOverPoint - 25, crossOverPoint + 50],
                ['rgba(255, 255, 255, 0.99)', 'rgba(255, 255, 255, 0)'],
                'RGB',
            ),
        };
    });

    const panGesture = Gesture.Pan()
        .activeOffsetY([-5, 5])
        .onStart(() => {
            contextY.value = sTranslateY.value;
        })
        .onUpdate(e => {
            sTranslateY.value = interpolate(
                e.translationY + contextY.value,
                [-1, 0, -initTranslateY * 0.8, -initTranslateY * 2],
                [-1, 0, -initTranslateY / 2, -initTranslateY],
                {
                    extrapolateLeft: Extrapolation.EXTEND,
                    extrapolateRight: Extrapolation.CLAMP,
                },
            );
        })
        .onFinalize(() => {
            if (sTranslateY.value > 0) {
                sTranslateY.value = withTiming(0, {
                    duration: 300,
                    easing: Easing.inOut(Easing.quad),
                });
            }
        });

    return (
        <View style={styles.container}>
            <GestureDetector gesture={panGesture}>
                <View>
                    <Animated.View
                        style={[
                            rButtonStyle,
                            styles.buttonsContainer,
                            { paddingTop: insets.top + 5 },
                        ]}>
                        <Pressable style={styles.button}>
                            <Ionicons
                                name="arrow-back-outline"
                                color="#384D48"
                                size={14}
                            />
                        </Pressable>
                        <Pressable style={styles.button}>
                            <SimpleLineIcons
                                name="options"
                                color="#384D48"
                                size={14}
                            />
                        </Pressable>
                    </Animated.View>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: headerImageUrl }}
                            style={{
                                width: width,
                                height: width,
                            }}
                        />

                        <Animated.View
                            style={[styles.imageOverlay, rOverlayStyle]}>
                            <LinearGradient
                                colors={['transparent', 'rgba(0, 0, 0, 0.4)']}
                                style={styles.gradient}>
                                <Text style={styles.titleText}>
                                    {route.params.pub.name}
                                </Text>
                                <View style={styles.bottomRowContainer}>
                                    <View style={styles.ratingsContainer}>
                                        <Ionicons
                                            name="star"
                                            size={10}
                                            color="#FFD700"
                                        />
                                        <Text style={styles.ratingsText}>
                                            {roundToNearest(
                                                route.params.pub
                                                    .overall_reviews,
                                                0.1,
                                            ).toFixed(1)}{' '}
                                            ({route.params.pub.num_reviews})
                                        </Text>
                                    </View>
                                    <View style={styles.distanceContainer}>
                                        <Text
                                            numberOfLines={1}
                                            style={styles.distanceText}>
                                            {distanceString(
                                                route.params.pub.dist_meters,
                                            )}
                                        </Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </Animated.View>
                    </View>
                    <Animated.View
                        style={[
                            styles.contentContainer,
                            rContentContainerStyle,
                        ]}>
                        <View>
                            <PubTopBar pub={route.params.pub} />
                        </View>
                        <View>
                            <PubDescription pub={route.params.pub} />
                        </View>

                        <View>
                            <PubFeatures pub={route.params.pub} />
                        </View>

                        <View>
                            <DraughtBeersList pub={route.params.pub} />
                        </View>

                        <View style={{ flex: 1 }}>
                            <TopTabNavigator />
                        </View>
                    </Animated.View>
                </View>
            </GestureDetector>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        height: '100%',
    },
    contentContainer: {
        backgroundColor: '#FFF',
        height: '100%',
    },
    buttonsContainer: {
        position: 'absolute',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 20,
        zIndex: 100,
        top: 0,
        paddingBottom: 5,
    },
    button: {
        height: 28,
        width: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    imageContainer: {
        position: 'relative',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    gradient: {
        flex: 1,
        height: 128,
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
        paddingBottom: 5,
    },
    titleText: {
        fontSize: 24,
        color: '#FFF',
        fontWeight: 'bold',
        fontFamily: 'Jost',
    },
    bottomRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ratingsText: {
        fontWeight: '300',
        color: '#fff',
        fontSize: 10,
        marginRight: 4,
    },
    distanceContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    distanceText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '300',
    },
});
