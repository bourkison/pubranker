import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import HomeMap from '@/components/Maps/HomeMap';
import BottomBarAnimated from '@/components/BottomBar/BottomBarAnimated';
import BottomBarContent from '@/components/BottomBar/BottomBarContent';
import TopBarOverlay from '@/components/BottomBar/TopOverlay';
import {
    interpolate,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';

export default function Home() {
    const { height } = useWindowDimensions();
    const open = Math.round(height * 0.1);
    const preview = Math.round(height * 0.6);
    const closed = Math.round(height * 0.82);

    const translateY = useSharedValue(closed);

    const animationProgress = useDerivedValue(() =>
        interpolate(translateY.value, [closed, open], [0, 1]),
    );

    return (
        <View style={styles.container}>
            <HomeMap />
            <TopBarOverlay
                height={height * 0.4}
                animationProgress={animationProgress}
            />
            <BottomBarAnimated
                open={open}
                preview={preview}
                closed={closed}
                translateY={translateY}>
                <BottomBarContent />
            </BottomBarAnimated>
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
        ...StyleSheet.absoluteFillObject,
    },
    bottomBarContainer: {
        height: 72,
        width: '100%',
        zIndex: 9,
        overflow: 'visible',
        backgroundColor: 'white',
    },
});
