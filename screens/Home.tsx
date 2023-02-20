import React, { useRef } from 'react';
// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, View } from 'react-native';
import HomeMap from '@/components/Maps/HomeMap';
import BottomBarAnimated from '@/components/Maps/BottomBar/BottomBarAnimated';
import BottomBarContent from '@/components/Maps/BottomBar/BottomBarContent';
import StatusBarInterpolate from '@/components/Maps/BottomBar/StatusBarInterpolate';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';

const SEARCH_BAR_SHADOW_OPACITY = 0.3;

export default function Home() {
    const BottomBarContainer = useRef<View>(null);
    const SearchBarContainer = useRef<Animated.View>(null);

    const translateY = useSharedValue(0);
    const minY = useSharedValue(0);

    const animationProgress = useDerivedValue(() => {
        const val = translateY.value / minY.value;

        if (isNaN(val)) {
            return 0;
        }

        return val;
    });

    const rSearchBarContainerStyle = useAnimatedStyle(() => {
        return {
            shadowOpacity: interpolate(
                animationProgress.value,
                [0, 0.9, 1],
                [SEARCH_BAR_SHADOW_OPACITY, SEARCH_BAR_SHADOW_OPACITY, 0],
            ),
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[styles.searchBarContainer, rSearchBarContainerStyle]}
                ref={SearchBarContainer}>
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor="#D1D5DB"
                    />
                </View>
            </Animated.View>
            <StatusBarInterpolate
                animationProgress={animationProgress}
                height={
                    styles.searchBarContainer.top + styles.searchInput.height
                }
            />
            <View style={styles.mapContainer}>
                <HomeMap />
            </View>
            <View style={styles.bottomBarContainer} ref={BottomBarContainer}>
                <BottomBarAnimated
                    translateY={translateY}
                    minY={minY}
                    containerRef={BottomBarContainer}
                    searchBarRef={SearchBarContainer}
                    animationProgress={animationProgress}>
                    <BottomBarContent />
                </BottomBarAnimated>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        backgroundColor: 'transparent',
    },
    searchBarContainer: {
        position: 'absolute',
        top: 50,
        width: '100%',
        paddingHorizontal: 25,
        zIndex: 3,
        elevation: 2,
    },
    searchBar: {
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: 'black',
        paddingHorizontal: 10,
    },
    searchInput: { width: '100%', height: 48 },
    mapContainer: {
        flex: 1,
        width: '100%',
        zIndex: 1,
    },
    bottomBarContainer: {
        height: 72,
        width: '100%',
        zIndex: 9,
        overflow: 'visible',
        backgroundColor: 'transparent',
    },
});
