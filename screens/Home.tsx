import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import HomeMap from '@/components/Maps/HomeMap';
import BottomBarAnimated from '@/components/BottomBar/BottomBarAnimated';
import TopBarOverlay from '@/components/BottomBar/TopOverlay';
import {
    interpolate,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import BottomBarNavigator from '@/nav/BottomBarNavigator';

export default function Home() {
    const { height } = useWindowDimensions();
    const open = Math.round(height * 0.1);
    const preview = Math.round(height * 0.6);
    const closed = Math.round(height * 0.82);

    const tabHeight = useBottomTabBarHeight();
    const translateY = useSharedValue(closed);

    const animationProgress = useDerivedValue(() =>
        interpolate(translateY.value, [closed, open], [0, 1]),
    );

    return (
        <View style={styles.container}>
            <HomeMap bottomPadding={height - closed - tabHeight} />
            <TopBarOverlay
                height={height * 0.4}
                animationProgress={animationProgress}
            />
            <BottomBarAnimated
                open={open}
                preview={preview}
                closed={closed}
                translateY={translateY}>
                <BottomBarNavigator />
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
});
