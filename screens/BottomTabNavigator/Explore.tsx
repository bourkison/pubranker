import PubList from '@/components/Pubs/RecommendedPubList';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from 'react-native';
import FiltersContainer from '@/components/Filters/FiltersContainer';
import { useAppSelector } from '@/store/hooks';
import SearchSuggestionList from '@/components/Search/SearchSuggestionList';
import HomeMap from '@/components/Maps/HomeMap';
import ViewMapButton from '@/components/Maps/ViewMapButton';
import Animated, {
    Easing,
    FadeIn,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import {
    COLLAPSE_MAP_BUTTON_TIMEOUT,
    MAX_MAP_BUTTON_WIDTH,
    MIN_MAP_BUTTON_WIDTH,
} from '@/constants';
import { ExploreContext } from '@/context/exploreContext';
import { useSharedCollectionContext } from '@/context/collectionContext';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import SearchProvider from '@/components/Search/SearchProvider';
import MapProvider from '@/components/Maps/MapProvider';
import { HomeNavigatorBottomTabProps } from '@/types/nav';
// import { Ionicons } from '@expo/vector-icons';

const COLLAPSE_ON_SCROLL_AMOUNT = 100;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function Explore({}: HomeNavigatorBottomTabProps<'Explore'>) {
    const { height } = useWindowDimensions();

    const [filterBarHeight, setFilterBarHeight] = useState(0);
    const mapBottomSheetAnimatedValue = useSharedValue(0);

    const exploreState = useAppSelector(state => state.explore.exploreState);
    const previousExploreState = useAppSelector(
        state => state.explore.previousExploreState,
    );

    const { setBottomTabHeight } = useSharedCollectionContext();
    const tabBarHeight = useBottomTabBarHeight();

    useEffect(
        () => setBottomTabHeight(tabBarHeight),
        [setBottomTabHeight, tabBarHeight],
    );

    // START VARIABLES FOR MAP BUTTON
    const sharedMapButtonWidth = useSharedValue(MAX_MAP_BUTTON_WIDTH);
    const [previousYScrollOffset, setPreviousYScrollOffset] = useState(0);
    const expandTimeout = useRef<NodeJS.Timeout | undefined>();

    const collapseMapButton = useCallback(() => {
        clearTimeout(expandTimeout.current);

        if (sharedMapButtonWidth.value === MIN_MAP_BUTTON_WIDTH) {
            return;
        }

        sharedMapButtonWidth.value = withTiming(MIN_MAP_BUTTON_WIDTH, {
            duration: 300,
            easing: Easing.inOut(Easing.quad),
        });
    }, [sharedMapButtonWidth]);

    const expandMapButton = useCallback(() => {
        clearTimeout(expandTimeout.current);

        if (sharedMapButtonWidth.value === MAX_MAP_BUTTON_WIDTH) {
            return;
        }

        sharedMapButtonWidth.value = withTiming(MAX_MAP_BUTTON_WIDTH, {
            duration: 300,
            easing: Easing.inOut(Easing.quad),
        });
    }, [sharedMapButtonWidth]);

    const toggleOnScroll = (yOffset: number) => {
        const diff = yOffset - previousYScrollOffset;
        setPreviousYScrollOffset(yOffset);

        if (yOffset > COLLAPSE_ON_SCROLL_AMOUNT && diff > 0) {
            collapseMapButton();
            return;
        }

        if (yOffset < COLLAPSE_ON_SCROLL_AMOUNT && diff < 0) {
            expandMapButton();

            clearTimeout(expandTimeout.current);

            expandTimeout.current = setTimeout(() => {
                collapseMapButton();
            }, COLLAPSE_MAP_BUTTON_TIMEOUT);

            return;
        }
    };
    // END VARIABLES FOR MAP BUTTON.

    // START SCROLLVIEW ANIMATION LOGIC
    const sScrollViewOpacity = useSharedValue(0);
    const sScrollViewTranslateY = useSharedValue(0);

    const rScrollViewStyle = useAnimatedStyle(() => ({
        opacity: sScrollViewOpacity.value,
        transform: [{ translateY: sScrollViewTranslateY.value }],
    }));

    // Run animations on ScrollView when changes occur.
    useEffect(() => {
        sScrollViewTranslateY.value = 0;

        if (exploreState === 'suggestions') {
            sScrollViewOpacity.value = 1;
        } else {
            sScrollViewOpacity.value = 0;
        }

        // FROM SEARCH ANIMATION
        if (
            previousExploreState === 'search' &&
            exploreState === 'suggestions'
        ) {
            sScrollViewOpacity.value = 0;
            sScrollViewTranslateY.value = -50;

            sScrollViewOpacity.value = withTiming(1, {
                duration: 300,
                easing: Easing.inOut(Easing.quad),
            });

            sScrollViewTranslateY.value = withTiming(0, {
                duration: 300,
                easing: Easing.inOut(Easing.quad),
            });
            sScrollViewTranslateY.value = withTiming(0, {
                duration: 300,
                easing: Easing.inOut(Easing.quad),
            });
        }

        // TO MAP ANIMATION
        if (previousExploreState === 'suggestions' && exploreState === 'map') {
            sScrollViewOpacity.value = withTiming(0, {
                duration: 500,
            });

            sScrollViewTranslateY.value = withTiming(height - 200, {
                duration: 500,
            });
        }

        // FROM MAP ANIMATION
        if (previousExploreState === 'map' && exploreState === 'suggestions') {
            sScrollViewOpacity.value = 0;

            sScrollViewOpacity.value = withTiming(1, {
                duration: 300,
                easing: Easing.inOut(Easing.quad),
            });
        }
    }, [
        previousExploreState,
        exploreState,
        sScrollViewOpacity,
        sScrollViewTranslateY,
        height,
    ]);
    //END SCROLLVIEW ANIMATION LOGIC

    return (
        <ExploreContext.Provider
            value={{
                filterBarHeight,
                setFilterBarHeight,
                mapBottomSheetAnimatedValue,
            }}>
            <MapProvider>
                <SearchProvider>
                    <View style={styles.container}>
                        <View style={styles.filtersContainer}>
                            <FiltersContainer />
                        </View>

                        <AnimatedScrollView
                            style={[
                                styles.exploreHomeContainer,
                                rScrollViewStyle,
                            ]}
                            onScroll={e =>
                                toggleOnScroll(e.nativeEvent.contentOffset.y)
                            }
                            scrollEventThrottle={160}>
                            <View style={styles.sectionContainer}>
                                <View style={styles.subheadingContainer}>
                                    <Text style={styles.subheading}>
                                        Top pubs nearby
                                    </Text>
                                </View>
                                <PubList />
                            </View>
                            <View style={styles.sectionContainer}>
                                <View style={styles.subheadingContainer}>
                                    <Text style={styles.subheading}>
                                        Top pubs in London
                                    </Text>
                                </View>
                                <PubList />
                            </View>
                            <View style={styles.sectionContainer}>
                                <View style={styles.subheadingContainer}>
                                    <Text style={styles.subheading}>
                                        Top rated pubs by vibe nearby
                                    </Text>
                                </View>
                                <PubList />
                            </View>
                        </AnimatedScrollView>
                        {exploreState === 'search' && (
                            <Animated.View
                                style={styles.suggestionsContainer}
                                entering={FadeIn}>
                                <SearchSuggestionList />
                            </Animated.View>
                        )}
                        {exploreState === 'map' && (
                            <Animated.View
                                style={styles.mapContainer}
                                exiting={FadeOut}>
                                <HomeMap />
                            </Animated.View>
                        )}
                        {exploreState !== 'map' && (
                            <View style={styles.mapButtonContainer}>
                                <KeyboardAvoidingView behavior="position">
                                    <ViewMapButton
                                        expand={expandMapButton}
                                        collapse={collapseMapButton}
                                        animatedWidth={sharedMapButtonWidth}
                                        expandTimeout={expandTimeout}
                                    />
                                </KeyboardAvoidingView>
                            </View>
                        )}
                    </View>
                </SearchProvider>
            </MapProvider>
        </ExploreContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
    },
    exploreHomeContainer: {
        flex: 1,
        // zIndex: -2, // Removed this, not sure why it was here originally.
    },
    filtersContainer: {
        marginBottom: 10,
        zIndex: 2,
    },
    suggestionsContainer: {
        width: '100%',
        height: '100%',
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        // zIndex: -1,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    subheadingContainer: {
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    subheading: {
        fontSize: 24,
        fontWeight: '500',
        color: '#292935',
    },
    mapButtonContainer: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        zIndex: 11,
    },
});
