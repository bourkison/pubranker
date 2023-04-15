import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

type RatingsBarProps = {
    height?: number;
    backgroundColor?: string;
    progressColor?: string;
    borderRadius?: number;
    current: number;
    max: number;
};

export default function RatingsBar({
    height = 10,
    backgroundColor = '#E5E7EB',
    progressColor = '#FFD700',
    borderRadius = 3,
    current,
    max,
}: RatingsBarProps) {
    const progress = useMemo(() => {
        let res = current;

        if (res > max) {
            res = max;
        }

        res = Math.round((res / max) * 100);

        return `${res}%`;
    }, [current, max]);

    const { width } = useWindowDimensions();

    const translateX = useSharedValue(-width);

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View
            onLayout={({ nativeEvent: { layout } }) => {
                translateX.value = -layout.width;
                translateX.value = withTiming(0, { duration: 1000 });
            }}
            style={[
                styles.backgroundBar,
                {
                    borderRadius: borderRadius,
                    height: height,
                    backgroundColor: backgroundColor,
                },
            ]}>
            <Animated.View
                style={[
                    styles.progressBar,
                    {
                        borderRadius: borderRadius,
                        height: height,
                        width: progress,
                        backgroundColor: progressColor,
                    },
                    rStyle,
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundBar: {
        width: '100%',
        overflow: 'hidden',
    },
    progressBar: {
        position: 'absolute',
        left: 0,
    },
});
