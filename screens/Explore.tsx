import PubList from '@/components/Pubs/PubList';
import { supabase } from '@/services/supabase';
import { PubSchema } from '@/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import * as Location from 'expo-location';
import FiltersContainer from '@/components/Filters/FiltersContainer';
import { useAppSelector } from '@/store/hooks';
import SearchSuggestionList from '@/components/Filters/SearchSuggestionList';
import HomeMap from '@/components/Maps/HomeMap';
import ViewMapButton from '@/components/Maps/ViewMapButton';
import Animated, {
    Easing,
    FadeIn,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import {
    COLLAPSE_MAP_BUTTON_TIMEOUT,
    MAX_MAP_BUTTON_WIDTH,
    MIN_MAP_BUTTON_WIDTH,
} from '@/constants';
// import { Ionicons } from '@expo/vector-icons';

const METERS_WITHIN = 1000;
const INITIAL_AMOUNT = 10;
const COLLAPSE_ON_SCROLL_AMOUNT = 100;

export default function Explore() {
    // TODO: Move this into a separate component.
    const [isLoading, setIsLoading] = useState(false);
    const [pubs, setPubs] = useState<PubSchema[]>([]);

    const exploreState = useAppSelector(state => state.explore.exploreState);

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

    useEffect(() => {
        const initialLoad = async () => {
            setIsLoading(true);

            let l = await Location.getCurrentPositionAsync();

            const { data, error } = await supabase
                .rpc('nearby_pubs', {
                    order_lat: l.coords.latitude,
                    order_long: l.coords.longitude,
                    dist_lat: l.coords.latitude,
                    dist_long: l.coords.longitude,
                })
                .lte('dist_meters', METERS_WITHIN)
                .limit(INITIAL_AMOUNT);

            if (error) {
                console.error(error);
                return;
            }

            setPubs(data);
            setIsLoading(false);
        };

        initialLoad();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.filtersContainer}>
                <FiltersContainer />
            </View>
            {exploreState === 'search' ? (
                <Animated.View
                    style={styles.suggestionsContainer}
                    entering={FadeIn}>
                    <SearchSuggestionList />
                </Animated.View>
            ) : undefined}
            {exploreState === 'map' ? (
                <Animated.View style={styles.mapContainer}>
                    <HomeMap />
                </Animated.View>
            ) : undefined}
            <ScrollView
                style={styles.container}
                onScroll={e => toggleOnScroll(e.nativeEvent.contentOffset.y)}
                scrollEventThrottle={160}>
                <View style={styles.sectionContainer}>
                    <View style={styles.subheadingContainer}>
                        <Text style={styles.subheading}>Top pubs nearby</Text>
                    </View>
                    <PubList pubs={pubs} isLoading={isLoading} />
                </View>
                <View style={styles.sectionContainer}>
                    <View style={styles.subheadingContainer}>
                        <Text style={styles.subheading}>
                            Top pubs in London
                        </Text>
                    </View>
                    <PubList pubs={pubs} isLoading={isLoading} />
                </View>
                <View style={styles.sectionContainer}>
                    <View style={styles.subheadingContainer}>
                        <Text style={styles.subheading}>
                            Top rated pubs by vibe nearby
                        </Text>
                    </View>
                    <PubList pubs={pubs} isLoading={isLoading} />
                </View>
            </ScrollView>
            {exploreState !== 'map' ? (
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
            ) : undefined}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filtersContainer: {
        marginBottom: 10,
    },
    suggestionsContainer: {
        width: '100%',
        height: '100%',
        zIndex: 2,
    },
    mapContainer: {
        width: '100%',
        height: '100%',
        zIndex: 2,
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
