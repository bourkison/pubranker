import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    BottomBarState,
    setAnimating,
    setBottomBarState,
} from '@/store/slices/pub';
import React, { RefObject, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Gesture,
    GestureDetector,
    ScrollView,
} from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    runOnUI,
    SharedValue,
    useAnimatedProps,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    WithSpringConfig,
    withTiming,
    WithTimingConfig,
} from 'react-native-reanimated';

type HomeBottomBarProps = {
    containerRef: RefObject<View>;
    children: JSX.Element;
    translateY: SharedValue<number>;
    minY: SharedValue<number>;
    animationProgress: SharedValue<number>;
};

const MARGIN_TOP = 100;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function HomeBottomBar({
    containerRef,
    children,
    translateY,
    minY,
    animationProgress,
}: HomeBottomBarProps) {
    const context = useSharedValue(0);
    const previewY = useSharedValue(0);
    const minHeight = useSharedValue(0);

    const scrollY = useSharedValue(0);
    const moving = useSharedValue(false);
    const scrollRef = useRef<ScrollView>(null);

    const bottomBarState = useAppSelector(state => state.pub.bottomBarState);

    const dispatch = useAppDispatch();

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
            minHeight: minHeight.value,
        };
    });

    const scrollHandler = useAnimatedScrollHandler(({ contentOffset }) => {
        scrollY.value = Math.round(contentOffset.y);
    });

    const scrollProps = useAnimatedProps(() => ({
        scrollEnabled: animationProgress.value >= 1,
        bounces: scrollY.value > 0 || !moving.value,
    }));

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

            const springAnimation: WithSpringConfig = {
                stiffness: 100,
                mass: 0.6,
                damping: 10,
            };

            const timingAnimation: WithTimingConfig = {
                duration: 250,
            };

            if (type === 'hidden') {
                translateY.value = withTiming(0, timingAnimation, () =>
                    runOnJS(setIsAnimating)(false),
                );
            } else if (type === 'expanded') {
                translateY.value = withSpring(minY.value, springAnimation, () =>
                    runOnJS(setIsAnimating)(false),
                );
            } else if (type === 'preview') {
                translateY.value = withSpring(
                    previewY.value,
                    springAnimation,
                    () => runOnJS(setIsAnimating)(false),
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

    const scrollTo = useCallback(
        (y: number) => {
            if (scrollRef && scrollRef.current) {
                scrollRef.current.scrollTo({
                    y: y,
                    animated: false,
                });
            }
        },
        [scrollRef],
    );

    const panGesture = Gesture.Pan()
        .onStart(() => {
            context.value = translateY.value;
            moving.value = true;

            if (!minY.value) {
                runOnJS(measureMinY)();
            }
        })
        .onUpdate(e => {
            const change = e.translationY + context.value;
            translateY.value = change;

            if (translateY.value > 0) {
                translateY.value = 0;
            } else if (translateY.value < minY.value) {
                translateY.value = minY.value;
            }

            // simulate scroll if user continues touching screen
            if (change < minY.value) {
                runOnJS(scrollTo)(-change - minY.value);
            }
        })
        .onFinalize(() => {
            moving.value = false;

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
        })
        .simultaneousWithExternalGesture(scrollRef);

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
                    <AnimatedScrollView
                        ref={scrollRef}
                        style={styles.contentContainer}
                        onScroll={scrollHandler}
                        animatedProps={scrollProps}>
                        {children}
                    </AnimatedScrollView>
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
