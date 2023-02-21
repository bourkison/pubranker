import React, { useRef } from 'react';
// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import HomeMap from '@/components/Maps/HomeMap';
import BottomBarAnimated from '@/components/BottomBar/BottomBarAnimated';
import BottomBarContent from '@/components/BottomBar/BottomBarContent';
import TopBarOverlay from '@/components/BottomBar/TopOverlay';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';

export default function Home() {
    const BottomBarContainer = useRef<View>(null);

    const translateY = useSharedValue(0);
    const minY = useSharedValue(0);

    const animationProgress = useDerivedValue(() => {
        const val = translateY.value / minY.value;

        if (isNaN(val)) {
            return 0;
        }

        return val;
    });

    return (
        <View style={styles.container}>
            <TopBarOverlay
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
        backgroundColor: 'white',
    },
});
