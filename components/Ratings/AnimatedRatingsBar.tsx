import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GOLD_RATINGS_COLOR } from '@/constants';
import { BAR_MARGINS } from '@/components/Ratings/RatingsSummary';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

type AnimatedRatingsBarProps = {
    val: number;
    maxVal: number;
    height: number;
    width: number;
    index: number;
    selected: number | null;
    setSelected: React.Dispatch<React.SetStateAction<number | null>>;
};

const MINIMUM_BAR_HEIGHT = 3;

export default function AnimatedRatingsBar({
    val,
    maxVal,
    height,
    width,
    index,
    selected,
}: AnimatedRatingsBarProps) {
    const sHeight = useSharedValue(MINIMUM_BAR_HEIGHT);

    const animatedStyle = useAnimatedStyle(() => ({
        height: sHeight.value,
    }));

    useEffect(() => {
        if (maxVal === 0) {
            sHeight.value = withTiming(MINIMUM_BAR_HEIGHT);
            return;
        }

        const temp = (val / maxVal) * height;

        sHeight.value = withTiming((temp ?? 0) + MINIMUM_BAR_HEIGHT);
    }, [val, maxVal, height, sHeight]);

    return (
        <View style={styles.pressable}>
            <View style={styles.barContainer}>
                <Animated.View
                    style={[
                        styles.ratingsBar,
                        { width },
                        selected === index
                            ? { backgroundColor: GOLD_RATINGS_COLOR }
                            : undefined,
                        animatedStyle,
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    pressable: {
        justifyContent: 'flex-end',
    },
    barContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    ratingsBar: {
        backgroundColor: `${GOLD_RATINGS_COLOR}77`,
        marginHorizontal: BAR_MARGINS,
        width: 20,
        borderRadius: 1,
        marginBottom: 4,
    },
});
