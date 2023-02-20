import React, { RefObject } from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

type HomeBottomBarProps = {
    containerRef: RefObject<View>;
    children: JSX.Element;
};

export default function HomeBottomBar({
    containerRef,
    children,
}: HomeBottomBarProps) {
    const context = useSharedValue(0);
    const translateY = useSharedValue(0);
    const minY = useSharedValue(0);
    const minHeight = useSharedValue(0);
    const expanded = useSharedValue(false);

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
            minHeight: minHeight.value,
        };
    });

    const measureMinY = () => {
        if (containerRef.current) {
            containerRef.current.measure(
                (x, y, width, height, pageX, pageY) => {
                    minY.value = -pageY + height;
                    minHeight.value = pageY;
                },
            );
        }
    };

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
            const animation = {
                duration: 300,
                easing: Easing.inOut(Easing.quad),
            };

            // If not expanded and should be.
            // Or expanded but didn't go far enough to close.
            // Go to expanded state
            if (
                (!expanded.value && translateY.value < -TRANSLATE_AMOUNT) ||
                (expanded.value &&
                    minY.value - translateY.value >= -TRANSLATE_AMOUNT)
            ) {
                expanded.value = true;
                translateY.value = withTiming(minY.value, animation);
            }
            // Vice versa
            else if (
                (expanded.value &&
                    minY.value - translateY.value < -TRANSLATE_AMOUNT) ||
                (!expanded.value && translateY.value >= -TRANSLATE_AMOUNT)
            ) {
                expanded.value = false;
                translateY.value = withTiming(0, animation);
            }

            console.log(
                minY.value,
                translateY.value,
                minY.value - translateY.value,
            );
        });

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
    },
    handleContainer: {
        flexBasis: 6,
        flexGrow: 0,
        flexShrink: 0,
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    handle: {
        width: 72,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        height: '100%',
        borderRadius: 10,
    },
    contentContainer: {
        marginTop: 5,
    },
});
