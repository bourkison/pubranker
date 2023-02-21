import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    BottomBarState,
    setAnimating,
    setBottomBarState,
} from '@/store/slices/pub';
import React, { RefObject, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    runOnJS,
    runOnUI,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

type HomeBottomBarProps = {
    containerRef: RefObject<View>;
    children: JSX.Element;
    translateY: SharedValue<number>;
    minY: SharedValue<number>;
};

const MARGIN_TOP = 100;

export default function HomeBottomBar({
    containerRef,
    children,
    translateY,
    minY,
}: HomeBottomBarProps) {
    const context = useSharedValue(0);
    const previewY = useSharedValue(0);
    const minHeight = useSharedValue(0);

    const bottomBarState = useAppSelector(state => state.pub.bottomBarState);

    const dispatch = useAppDispatch();

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
            minHeight: minHeight.value,
        };
    });

    // Our minY is equal to -y position of container, + search y position and height.
    // Our min height is equal to y position of container - y position of
    const measureMinY = () => {
        if (containerRef.current) {
            containerRef.current.measure(
                (_x, _y, _width, contHeight, _pageX, contPageY) => {
                    minY.value = -contPageY + MARGIN_TOP;
                    minHeight.value = contPageY + contHeight - MARGIN_TOP;

                    previewY.value = minY.value * 0.4;
                },
            );
        }
    };

    const setIsAnimating = useCallback(
        (val: boolean) => {
            dispatch(setAnimating(val));
        },
        [dispatch],
    );

    const animateBar = useCallback(
        (type: BottomBarState) => {
            'worklet';

            runOnJS(setIsAnimating)(true);

            const animation = {
                duration: 300,
                easing: Easing.inOut(Easing.quad),
            };

            if (type === 'hidden') {
                translateY.value = withTiming(0, animation, () =>
                    runOnJS(setIsAnimating)(false),
                );
            } else if (type === 'expanded') {
                translateY.value = withTiming(minY.value, animation, () =>
                    runOnJS(setIsAnimating)(false),
                );
            } else if (type === 'preview') {
                translateY.value = withTiming(previewY.value, animation, () =>
                    runOnJS(setIsAnimating)(false),
                );
            }
        },
        [minY.value, translateY, previewY.value, setIsAnimating],
    );

    const setState = useCallback(
        (s: BottomBarState) => {
            dispatch(setBottomBarState(s));
        },
        [dispatch],
    );

    const panGesture = Gesture.Pan()
        .onStart(() => {
            context.value = translateY.value;

            if (!minY.value) {
                runOnJS(measureMinY)();
            }
        })
        .onUpdate(e => {
            translateY.value = e.translationY + context.value;

            if (translateY.value > 0) {
                translateY.value = 0;
            } else if (translateY.value < minY.value) {
                translateY.value = minY.value;
            }
        })
        .onFinalize(() => {
            const TRANSLATE_AMOUNT = 100;
            const PREVIEW_BOUNDARY = 50;

            if (
                (bottomBarState === 'expanded' && // If expanded
                    translateY.value > minY.value + TRANSLATE_AMOUNT && // And outside of bounds to go back to expanded
                    translateY.value < previewY.value + PREVIEW_BOUNDARY) || // But still not far enough to hide
                (bottomBarState === 'hidden' && // Or, if hidden
                    translateY.value < -TRANSLATE_AMOUNT && // And outside of bounds to go back hidden
                    translateY.value > previewY.value - PREVIEW_BOUNDARY) || // But still not far enough to expand
                (bottomBarState === 'preview' && // Or, if already on preview
                    translateY.value < previewY.value + PREVIEW_BOUNDARY &&
                    translateY.value > previewY.value - PREVIEW_BOUNDARY)
            ) {
                runOnJS(setState)('preview');
                animateBar('preview');
            } else if (
                (bottomBarState === 'expanded' && // If expanded
                    translateY.value < minY.value + TRANSLATE_AMOUNT) || // And within bounds to go back to expanded
                ((bottomBarState === 'hidden' ||
                    bottomBarState === 'preview') && // Or, if hidden or on preview
                    translateY.value < previewY.value - PREVIEW_BOUNDARY) // And outside of preview boundary
            ) {
                runOnJS(setState)('expanded');
                animateBar('expanded');
            } else if (
                ((bottomBarState === 'expanded' ||
                    bottomBarState === 'preview') && // If expanded or preview
                    translateY.value > previewY.value + PREVIEW_BOUNDARY) || // And outside of preview boundary
                (bottomBarState === 'hidden' && // Or, if hidden
                    translateY.value > -TRANSLATE_AMOUNT) // And within bounds to go back
            ) {
                runOnJS(setState)('hidden');
                animateBar('hidden');
            }
        });

    useEffect(() => {
        runOnUI(animateBar)(bottomBarState);
    }, [bottomBarState, animateBar]);

    return (
        <Animated.View
            style={[styles.container, rStyle]}
            onLayout={measureMinY}>
            <GestureDetector gesture={panGesture}>
                <View>
                    <View style={styles.handleContainer}>
                        <View style={styles.handle} />
                    </View>
                    <View style={styles.contentContainer}>{children}</View>
                </View>
            </GestureDetector>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        zIndex: 9,
        overflow: 'visible',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
    },
    handleContainer: {
        flexBasis: 4,
        flexGrow: 0,
        flexShrink: 0,
        marginVertical: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    handle: {
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        height: '100%',
        borderRadius: 10,
    },
    contentContainer: {
        marginTop: 5,
    },
});
