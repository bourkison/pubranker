// https://github.com/software-mansion/react-native-gesture-handler/issues/420#issuecomment-1356861934

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    BottomBarState,
    setAnimating,
    setBottomBarState,
} from '@/store/slices/pub';
import React, { useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, Pressable } from 'react-native';
import {
    Gesture,
    GestureDetector,
    ScrollView,
} from 'react-native-gesture-handler';
import Animated, {
    interpolate,
    runOnJS,
    WithSpringConfig,
    useAnimatedProps,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnUI,
    SharedValue,
} from 'react-native-reanimated';

type HomeBottomBarProps = {
    children: JSX.Element;
    readonly open: number;
    readonly preview: number;
    readonly closed: number;
    readonly translateY: SharedValue<number>;
};

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function HomeBottomBar({
    children,
    open,
    preview,
    closed,
    translateY,
}: HomeBottomBarProps) {
    const scrollRef = useRef<ScrollView>(null);

    const { height } = useWindowDimensions();

    const moving = useSharedValue(false);
    const prevY = useSharedValue(closed);
    const movedY = useSharedValue(0);
    const scrollY = useSharedValue(0);

    const bottomBarState = useAppSelector(state => state.pub.bottomBarState);
    const dispatch = useAppDispatch();

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        translateY.value,
                        [0, open, closed, height],
                        [open, open, closed, closed + 20],
                        'clamp',
                    ),
                },
            ],
        };
    });

    const scrollHandler = useAnimatedScrollHandler(({ contentOffset }) => {
        scrollY.value = Math.round(contentOffset.y);
    });

    const scrollProps = useAnimatedProps(() => {
        return {
            // only scroll if sheet is open
            scrollEnabled: prevY.value === open,
            // only bounce at bottom or not touching screen
            bounces: scrollY.value > 0 || !moving.value,
        };
    });

    const scrollTo = useCallback(
        (y: number) => {
            if (scrollRef && scrollRef.current) {
                scrollRef?.current.scrollTo({
                    y: y,
                    animated: false,
                });
            }
        },
        [scrollRef],
    );

    const setState = useCallback(
        (s: BottomBarState) => {
            dispatch(setBottomBarState(s));
        },
        [dispatch],
    );

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

            const roundedTransY = Math.round(translateY.value);

            if (type === 'hidden') {
                translateY.value = withSpring(closed, springAnimation, () =>
                    runOnJS(setIsAnimating)(false),
                );

                prevY.value = closed;
            } else if (type === 'expanded') {
                if (roundedTransY > open) {
                    translateY.value = withSpring(open, springAnimation, () =>
                        runOnJS(setIsAnimating)(false),
                    );
                }

                prevY.value = open;
            } else if (type === 'preview') {
                translateY.value = withSpring(preview, springAnimation, () =>
                    runOnJS(setIsAnimating)(false),
                );
                prevY.value = preview;
            }
        },
        [translateY, setIsAnimating, closed, open, preview, prevY],
    );

    const panGesture = Gesture.Pan()
        .onBegin(() => {
            // touching screen
            moving.value = true;
        })
        .onUpdate(e => {
            // move sheet if top or scrollview or is closed state
            if (
                scrollY.value === 0 ||
                prevY.value === closed ||
                prevY.value === preview
            ) {
                translateY.value = prevY.value + e.translationY - movedY.value;

                // capture movement, but don't move sheet
            } else {
                movedY.value = e.translationY;
            }

            // simulate scroll if user continues touching screen
            if (prevY.value !== open && translateY.value < open) {
                runOnJS(scrollTo)(-translateY.value + open);
            }
        })
        .onEnd(() => {
            const TRANSLATE_AMOUNT = 100;
            const PREVIEW_BOUNDARY = 50;

            if (
                (bottomBarState === 'expanded' && // If expanded
                    translateY.value > open + TRANSLATE_AMOUNT && // And outside of bounds to go back to expanded
                    translateY.value < preview + PREVIEW_BOUNDARY) || // But still not far enough to hide
                (bottomBarState === 'hidden' && // Or, if hidden
                    translateY.value < closed - TRANSLATE_AMOUNT && // And outside of bounds to go back hidden
                    translateY.value > preview - PREVIEW_BOUNDARY) || // But still not far enough to expand
                (bottomBarState === 'preview' && // Or, if already on preview
                    translateY.value < preview + PREVIEW_BOUNDARY &&
                    translateY.value > preview - PREVIEW_BOUNDARY)
            ) {
                runOnJS(setState)('preview');
                animateBar('preview');
            } else if (
                (bottomBarState === 'expanded' && // If expanded
                    translateY.value < open + TRANSLATE_AMOUNT) || // And within bounds to go back to expanded
                ((bottomBarState === 'hidden' ||
                    bottomBarState === 'preview') && // Or, if hidden or on preview
                    translateY.value < preview - PREVIEW_BOUNDARY) // And outside of preview boundary
            ) {
                runOnJS(setState)('expanded');
                animateBar('expanded');
            } else if (
                ((bottomBarState === 'expanded' ||
                    bottomBarState === 'preview') && // If expanded or preview
                    translateY.value > preview + PREVIEW_BOUNDARY) || // And outside of preview boundary
                (bottomBarState === 'hidden' && // Or, if hidden
                    translateY.value > -TRANSLATE_AMOUNT) // And within bounds to go back
            ) {
                runOnJS(setState)('hidden');
                animateBar('hidden');
            }
        })
        .onFinalize(() => {
            // stopped touching screen
            moving.value = false;
            movedY.value = 0;
        })
        .simultaneousWithExternalGesture(scrollRef);

    useEffect(() => {
        runOnUI(animateBar)(bottomBarState);
    }, [bottomBarState, animateBar]);

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.container, rStyle]}>
                <View>
                    <View style={styles.handleContainer}>
                        <Pressable
                            style={styles.handle}
                            onPressIn={() => console.log('PRESS')}
                        />
                    </View>
                    <AnimatedScrollView
                        scrollEventThrottle={1}
                        ref={scrollRef}
                        style={styles.contentContainer}
                        onScroll={scrollHandler}
                        animatedProps={scrollProps}>
                        {children}
                    </AnimatedScrollView>
                </View>
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        zIndex: 9,
        overflow: 'visible',
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
