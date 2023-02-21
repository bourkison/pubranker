import { useAppDispatch } from '@/store/hooks';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
    interpolateColor,
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';
import { setBottomBarState } from '@/store/slices/pub';

type StatusBarInterpolateProps = {
    height: number;
    animationProgress: SharedValue<number>;
};

export default function StatusBarInterpolate({
    animationProgress,
}: StatusBarInterpolateProps) {
    const dispatch = useAppDispatch();

    const rStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                animationProgress.value,
                [0, 0.7, 1],
                ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)'],
            ),
            zIndex: animationProgress.value > 0.7 ? 2 : -1,
        };
    });

    return (
        <Animated.View style={[styles.container, rStyle]}>
            <Pressable
                style={styles.pressableContainer}
                onPress={() => dispatch(setBottomBarState('hidden'))}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 2,
        left: 0,
        right: 0,
        bottom: 0,
    },
    pressableContainer: {
        flex: 1,
    },
});
