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
import { GOLD_RATINGS_COLOR, PUB_HOME_IMAGE_ASPECT_RATIO } from '@/constants';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    Extrapolation,
    interpolate,
    interpolateColor,
    measure,
    runOnUI,
    useAnimatedRef,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopTabs from '@/components/Utility/TopTabs';
import PubReviews from '@/components/Reviews/PubReviews';
import PubGallery from '../../components/Pubs/PubView/PubGallery';
import PubDetails from '@/components/Pubs/PubView/PubDetails';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ReviewContext } from '@/context/reviews';
import { UserReviewType } from '@/types';
import { PubHomeContext } from '@/context/pubHome';

export default function PubHome({
    route,
    navigation,
}: StackScreenProps<MainNavigatorStackParamList, 'PubView'>) {
    const [headerImageUrl, setHeaderImageUrl] = useState('');

    const [reviews, setReviews] = useState<UserReviewType[]>([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);

    const { width, height } = useWindowDimensions();

    const { showActionSheetWithOptions } = useActionSheet();

    const animatedContainerRef = useAnimatedRef();

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

    // Height change is a negative number indicating difference in height on the next frame to take into account.
    const withinScrollBoundsWorklet = (
        withAnimation: boolean,
        heightChange = 0,
    ) => {
        'worklet';
        const { height: contentContainerHeight }: { height: number } =
            measure(animatedContainerRef);

        if (!contentContainerHeight) {
            return;
        }

        const screenHeightBeingUsed = height - width; // Height of content container if no translation and not including overflow
        const screenOverflow =
            contentContainerHeight -
            screenHeightBeingUsed +
            initTranslateY +
            heightChange; // Height of pixels off screen.

        if (sTranslateY.value > 0) {
            sTranslateY.value = withAnimation
                ? withTiming(0, {
                      duration: 300,
                      easing: Easing.inOut(Easing.quad),
                  })
                : 0;
        } else if (sTranslateY.value < -screenOverflow) {
            sTranslateY.value = withAnimation
                ? withTiming(-screenOverflow - heightChange, {
                      duration: 300,
                      easing: Easing.inOut(Easing.quad),
                  })
                : -screenOverflow;
        }
    };

    const panGesture = Gesture.Pan()
        .activeOffsetY([-5, 5])
        .onStart(() => {
            contextY.value = sTranslateY.value;
        })
        .onUpdate(e => {
            const { height: contentContainerHeight }: { height: number } =
                measure(animatedContainerRef);

            if (!contentContainerHeight) {
                return;
            }

            const screenHeightBeingUsed = height - width; // Height of pixels being used if not translation (and not including overflow)
            const screenOverflow =
                contentContainerHeight - screenHeightBeingUsed + initTranslateY; // Height of pixels off screen.

            sTranslateY.value = interpolate(
                e.translationY + contextY.value,
                [
                    -screenOverflow - 70,
                    -screenOverflow - 50,
                    -screenOverflow,
                    0,
                    -initTranslateY * 0.8,
                    -initTranslateY * 2,
                ],
                [
                    -screenOverflow - 50,
                    -screenOverflow - 40,
                    -screenOverflow,
                    0,
                    -initTranslateY / 2,
                    -initTranslateY,
                ],
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP,
                },
            );
        })
        .onFinalize(() => {
            withinScrollBoundsWorklet(true);
        });

    // Height change is a negative number indicating difference in height on the next frame to take into account.
    const calculateWithinScrollBounds = () => {
        runOnUI(withinScrollBoundsWorklet)(false);
    };

    return (
        <PubHomeContext.Provider value={{ calculateWithinScrollBounds }}>
            <View style={styles.container}>
                <GestureDetector gesture={panGesture}>
                    <View>
                        <Animated.View
                            style={[
                                rButtonStyle,
                                styles.buttonsContainer,
                                { paddingTop: insets.top + 5 },
                            ]}>
                            <Pressable
                                style={styles.button}
                                onPress={() => navigation.goBack()}>
                                <Ionicons
                                    name="arrow-back-outline"
                                    color="#384D48"
                                    size={14}
                                />
                            </Pressable>
                            <Pressable
                                style={styles.button}
                                onPress={() =>
                                    showActionSheetWithOptions(
                                        {
                                            options: [
                                                'Save',
                                                'Write Review',
                                                'Suggest an edit',
                                                'Cancel',
                                            ],
                                            cancelButtonIndex: 3,
                                            tintColor: '#384D48',
                                            cancelButtonTintColor: '#384D48',
                                        },
                                        selected => {
                                            console.log('select', selected);
                                        },
                                    )
                                }>
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
                                    colors={[
                                        'transparent',
                                        'rgba(0, 0, 0, 0.4)',
                                    ]}
                                    style={styles.gradient}>
                                    <Text style={styles.titleText}>
                                        {route.params.pub.name}
                                    </Text>
                                    <View style={styles.bottomRowContainer}>
                                        <View style={styles.ratingsContainer}>
                                            <Ionicons
                                                name="star"
                                                size={10}
                                                color={GOLD_RATINGS_COLOR}
                                            />
                                            <Text style={styles.ratingsText}>
                                                {roundToNearest(
                                                    route.params.pub.rating,
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
                                                    route.params.pub
                                                        .dist_meters,
                                                )}
                                            </Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </Animated.View>
                        </View>
                        <Animated.View
                            // @ts-ignore
                            ref={animatedContainerRef}
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
                                <TopTabs
                                    data={[
                                        {
                                            title: 'Gallery',
                                            component: (
                                                <PubGallery
                                                    pub={route.params.pub}
                                                />
                                            ),
                                        },
                                    ]}
                                />
                            </View>

                            <View>
                                <ReviewContext.Provider
                                    value={{
                                        reviews,
                                        setReviews,
                                        isLoading: isLoadingReviews,
                                        setIsLoading: setIsLoadingReviews,
                                    }}>
                                    <TopTabs
                                        data={[
                                            {
                                                title: `Reviews (${route.params.pub.num_reviews})`,
                                                component: (
                                                    <PubReviews
                                                        pub={route.params.pub}
                                                    />
                                                ),
                                            },
                                            {
                                                title: `User Photos (${route.params.pub.photos.length})`,
                                                component: (
                                                    <PubGallery
                                                        pub={route.params.pub}
                                                    />
                                                ),
                                            },
                                            {
                                                title: 'Menu',
                                                component: (
                                                    <View>
                                                        <Text>Menu</Text>
                                                    </View>
                                                ),
                                            },
                                            {
                                                title: 'Additional Information',
                                                component: (
                                                    <PubDetails
                                                        pub={route.params.pub}
                                                    />
                                                ),
                                            },
                                            {
                                                title: 'Similar Pubs',
                                                component: (
                                                    <View>
                                                        <Text>Test</Text>
                                                    </View>
                                                ),
                                            },
                                        ]}
                                    />
                                </ReviewContext.Provider>
                            </View>
                        </Animated.View>
                    </View>
                </GestureDetector>
            </View>
        </PubHomeContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        height: '100%',
    },
    contentContainer: {
        backgroundColor: '#fff',
        paddingBottom: 25,
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
