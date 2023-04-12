import React, {
    useEffect,
    forwardRef,
    useCallback,
    useImperativeHandle,
} from 'react';
import { View } from 'react-native';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

type BottomSheetProps = {
    snapPoints: number[];
    initialIndex: number;
    children: JSX.Element;
};

type BottomSheetRefProps = {
    snapTo: (index: number) => void;
    open: () => void;
    expand: () => void;
};

const BottomSheet = forwardRef<BottomSheetRefProps, BottomSheetProps>(
    ({ snapPoints, initialIndex }, ref) => {
        const { height: SCREEN_HEIGHT } = useWindowDimensions();
        const MAX_TRANSLATE_Y =
            snapPoints[snapPoints.length - 1] * -SCREEN_HEIGHT;
        const translateY = useSharedValue(0);
        const context = useSharedValue({ y: 0 });

        const snapTo = useCallback(
            (n: number) => {
                'worklet';
                translateY.value = withSpring(snapPoints[n] * -SCREEN_HEIGHT, {
                    damping: 50,
                });
            },
            [snapPoints, translateY, SCREEN_HEIGHT],
        );

        const open = useCallback(() => {
            'worklet';
            snapTo(snapPoints[0]);
        }, [snapPoints, snapTo]);

        const expand = useCallback(() => {
            'worklet';
            snapTo(snapPoints.length - 1);
        }, [snapPoints, snapTo]);

        useImperativeHandle(ref, () => ({ snapTo, open, expand }), [
            snapTo,
            open,
            expand,
        ]);

        // Returns element closest to target in arr[]
        const findClosest = (arr: number[], target: number) => {
            'worklet';
            for (let i = 0; i < arr.length - 1; i++) {
                const num = arr[i];
                const nextNum = arr[i + 1];

                if (Math.abs(target - num) < Math.abs(target - nextNum)) {
                    return i;
                }
            }

            return arr.length - 1;
        };

        const gesture = Gesture.Pan()
            .onStart(() => {
                context.value = { y: translateY.value };
            })
            .onUpdate(event => {
                translateY.value = event.translationY + context.value.y;
                translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
            })
            .onEnd(() => {
                const amount = Math.max(
                    findClosest(
                        snapPoints.map(p => p * MAX_TRANSLATE_Y),
                        translateY.value,
                    ),
                    MAX_TRANSLATE_Y,
                );

                snapTo(amount);
            });

        const rBottomSheetStyle = useAnimatedStyle(() => {
            const borderRadius = interpolate(
                translateY.value,
                [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
                [25, 5],
                Extrapolate.CLAMP,
            );

            return {
                borderRadius,
                transform: [{ translateY: translateY.value }],
            };
        });

        useEffect(() => {
            snapTo(initialIndex);
        }, [initialIndex, snapTo]);

        return (
            <GestureDetector gesture={gesture}>
                <Animated.View
                    style={[
                        styles.container,
                        { height: SCREEN_HEIGHT, top: SCREEN_HEIGHT },
                        rBottomSheetStyle,
                    ]}>
                    <View style={styles.handle} />
                </Animated.View>
            </GestureDetector>
        );
    },
);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'white',
        position: 'absolute',
        borderRadius: 25,
    },
    handle: {
        width: 75,
        height: 4,
        backgroundColor: '#A3A3A3',
        alignSelf: 'center',
        marginVertical: 15,
        borderRadius: 2,
    },
});

export default BottomSheet;
