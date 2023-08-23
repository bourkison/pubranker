import { GOLD_RATINGS_COLOR } from '@/constants';
import React, { useEffect, useMemo, useState } from 'react';
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
    backgroundColor = 'transparent',
    progressColor = GOLD_RATINGS_COLOR,
    borderRadius = 3,
    current,
    max,
}: RatingsBarProps) {
    const [elementWidth, setElementWidth] = useState(0);
    const { width } = useWindowDimensions();

    const progress = useMemo(() => {
        if (elementWidth === 0) {
            return -width;
        }

        let res = current;

        if (res > max) {
            res = max;
        }

        res = res / max;

        return (1 - res) * elementWidth;
    }, [current, max, elementWidth, width]);

    const translateX = useSharedValue(-width);
    const hasAnimated = useSharedValue(false);

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    useEffect(() => {
        if (elementWidth !== 0) {
            if (!hasAnimated.value) {
                translateX.value = -elementWidth;
                hasAnimated.value = true;
            }

            translateX.value = withTiming(0 - progress, { duration: 500 });
        }
    }, [current, translateX, elementWidth, hasAnimated, progress]);

    return (
        <View
            onLayout={({ nativeEvent: { layout } }) => {
                setElementWidth(layout.width);
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
        width: '100%',
    },
});
