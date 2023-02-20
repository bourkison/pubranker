import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    interpolateColor,
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';

type StatusBarInterpolateProps = {
    height: number;
    animationProgress: SharedValue<number>;
};

export default function StatusBarInterpolate({
    height,
    animationProgress,
}: StatusBarInterpolateProps) {
    const rStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                animationProgress.value,
                [0, 0.7, 1],
                [
                    'rgba(255, 255, 255, 0)',
                    'rgba(255, 255, 255, 0)',
                    'rgba(255, 255, 255, 1)',
                ],
            ),
        };
    });

    return <Animated.View style={[styles.container, { height }, rStyle]} />;
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 2,
        left: 0,
        right: 0,
    },
});
