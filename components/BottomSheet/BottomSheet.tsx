// https://www.youtube.com/watch?v=KvRqsRwpwhY

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React, {
    useEffect,
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useState,
    RefObject,
} from 'react';
import { View } from 'react-native';
import { StyleSheet, useWindowDimensions } from 'react-native';
import {
    Gesture,
    GestureDetector,
    ScrollView,
} from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    scrollTo,
} from 'react-native-reanimated';
import { BottomSheetContext } from '@/components/BottomSheet/context';

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
    ({ snapPoints, initialIndex, children }, ref) => {
        const { height: sHeight } = useWindowDimensions();
        const bottomTabBarHeight = useBottomTabBarHeight();

        const AVAILABLE_HEIGHT = useMemo(
            () => sHeight - bottomTabBarHeight,
            [sHeight, bottomTabBarHeight],
        );

        const context = useSharedValue({ y: 0, scrollY: 0 });

        const translateY = useSharedValue(0);
        const scrollY = useSharedValue(0);
        const isExpanded = useSharedValue(false);
        const hasCollapsed = useSharedValue(false);
        const scrollViewIsAnimating = useSharedValue(false);

        const [scrollableRefs, setScrollableRefs] = useState<
            RefObject<ScrollView>[]
        >([]);

        const MAX_TRANSLATE_Y =
            snapPoints[snapPoints.length - 1] * -AVAILABLE_HEIGHT;
        const snapTo = useCallback(
            (n: number) => {
                'worklet';
                translateY.value = withSpring(
                    snapPoints[n] * -AVAILABLE_HEIGHT,
                    {
                        damping: 50,
                    },
                );

                if (n === snapPoints.length - 1) {
                    isExpanded.value = true;
                } else {
                    isExpanded.value = false;
                }
            },
            [snapPoints, translateY, AVAILABLE_HEIGHT, isExpanded],
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

        let gesture = Gesture.Pan()
            .onStart(() => {
                context.value = { y: translateY.value, scrollY: scrollY.value };
                hasCollapsed.value = false;
            })
            .onUpdate(event => {
                // Move sheet if top of scroll view or not expanded.
                if (scrollY.value === 0 || !isExpanded.value) {
                    translateY.value = event.translationY + context.value.y;
                    translateY.value = Math.max(
                        translateY.value,
                        MAX_TRANSLATE_Y,
                    );
                }

                let shouldManuallyScrollTo = -1;

                const initiallyExpanded = context.value.y === MAX_TRANSLATE_Y;
                const nowExpanded = translateY.value === MAX_TRANSLATE_Y;

                // If our translationY is greater than our initial scrollY
                // Scroll to top so we can begin moving sheet next update.
                // TODO: Should also include check here for the bug where start not expanded
                // expand, scroll down, then try to collapse again.
                if (
                    event.translationY >= context.value.scrollY &&
                    scrollY.value !== 0
                ) {
                    shouldManuallyScrollTo = 0;
                    scrollY.value = 0;
                    context.value = { y: context.value.y, scrollY: 0 };
                    translateY.value = event.translationY + context.value.y;
                    translateY.value = Math.max(
                        translateY.value,
                        MAX_TRANSLATE_Y,
                    );
                }
                // If we weren't initially expanded
                // AND we're now expanded
                // Manually scroll.
                else if (!initiallyExpanded && nowExpanded) {
                    const overshoot =
                        MAX_TRANSLATE_Y -
                        (event.translationY + context.value.y);

                    shouldManuallyScrollTo = context.value.scrollY + overshoot;
                }
                // If we're initially expanded
                // AND we have collapsed at one point
                // AND we're again expanded
                // Manually scroll
                else if (
                    initiallyExpanded &&
                    hasCollapsed.value &&
                    nowExpanded
                ) {
                    const overshoot =
                        MAX_TRANSLATE_Y -
                        (event.translationY + context.value.y);

                    shouldManuallyScrollTo = Math.max(
                        context.value.scrollY + overshoot,
                        0,
                    );
                }

                // Only apply above if there exists a ref and that ref is not already animating.
                if (
                    shouldManuallyScrollTo > -1 &&
                    scrollableRefs[scrollableRefs.length - 1] &&
                    !scrollViewIsAnimating.value
                ) {
                    scrollTo(
                        scrollableRefs[scrollableRefs.length - 1],
                        0,
                        shouldManuallyScrollTo,
                        false,
                    );
                }

                if (
                    !hasCollapsed.value &&
                    translateY.value !== MAX_TRANSLATE_Y
                ) {
                    hasCollapsed.value = true;
                }

                isExpanded.value = translateY.value === MAX_TRANSLATE_Y;
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

        if (scrollableRefs.length) {
            gesture = gesture.simultaneousWithExternalGesture(
                scrollableRefs[scrollableRefs.length - 1],
            );
        }

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
            <BottomSheetContext.Provider
                value={{
                    translateY,
                    isExpanded,
                    scrollY,
                    scrollableRefs,
                    setScrollableRefs,
                    scrollViewIsAnimating,
                }}>
                <GestureDetector gesture={gesture}>
                    <Animated.View
                        style={[
                            styles.container,
                            {
                                height:
                                    AVAILABLE_HEIGHT *
                                    snapPoints[snapPoints.length - 1],
                                top: AVAILABLE_HEIGHT,
                            },
                            rBottomSheetStyle,
                        ]}>
                        <View style={styles.handle} />
                        <View style={[styles.contentContainer]}>
                            {children}
                        </View>
                    </Animated.View>
                </GestureDetector>
            </BottomSheetContext.Provider>
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
        width: 25,
        height: 4,
        backgroundColor: '#A3A3A3',
        alignSelf: 'center',
        marginVertical: 15,
        borderRadius: 2,
    },
    contentContainer: {
        flex: 1,
    },
});

export default BottomSheet;