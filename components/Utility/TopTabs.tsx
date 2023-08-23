import { useSharedPubHomeContext } from '@/context/pubHome';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

type InputData = {
    textWidth: number;
    xPos: number;
    title: string;
    component: JSX.Element;
};

type TopTabsProps = {
    data: {
        title: string;
        component: JSX.Element;
    }[];
};

export default function TopTabs({ data }: TopTabsProps) {
    const [inputData, setInputData] = useState<InputData[]>([]);
    const [selectedPage, setSelectedPage] = useState(0);

    const { width } = useWindowDimensions();

    const { calculateWithinScrollBounds } = useSharedPubHomeContext();

    const sIndicatorTranslateX = useSharedValue(0);
    const sIndicatorWidth = useSharedValue(1);

    const sScrollTranslateX = useSharedValue(0);

    const sLastElementXPos = useSharedValue(0);
    const sLastElementWidth = useSharedValue(0);

    const derivedScrollOffset = useDerivedValue(() =>
        Math.max(
            sLastElementXPos.value +
                sLastElementWidth.value -
                width +
                styles.container.marginHorizontal * 2,
            0,
        ),
    );

    const contextX = useSharedValue(0);

    const rScrollStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: sScrollTranslateX.value }],
    }));

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: sIndicatorTranslateX.value }],
        width: sIndicatorWidth.value,
    }));

    useEffect(() => {
        if (inputData.length) {
            return;
        }

        let arr: InputData[] = [];

        data.forEach(t => {
            arr.push({
                textWidth: 0,
                xPos: 0,
                title: t.title,
                component: t.component,
            });
        });

        setInputData(arr);
    }, [data, inputData]);

    const calculateXPos = (index: number, x: number) => {
        if (index === 0) {
            sIndicatorTranslateX.value = x;
        } else if (index === inputData.length - 1) {
            sLastElementXPos.value = x;
        }

        setInputData(d => {
            d[index].xPos = x;
            return d;
        });
    };

    const calculateTextWidth = (index: number, w: number) => {
        if (index === 0) {
            sIndicatorWidth.value = w;
        } else if (index === inputData.length - 1) {
            sLastElementWidth.value = w;
        }

        setInputData(d => {
            d[index].textWidth = w;
            return d;
        });
    };

    const itemSelection = (index: number) => {
        setSelectedPage(index);

        sIndicatorTranslateX.value = withTiming(inputData[index].xPos, {
            duration: 300,
            easing: Easing.inOut(Easing.quad),
        });

        sIndicatorWidth.value = withTiming(inputData[index].textWidth, {
            duration: 300,
            easing: Easing.inOut(Easing.quad),
        });

        if (inputData[index].xPos < -sScrollTranslateX.value) {
            sScrollTranslateX.value = withTiming(-inputData[index].xPos, {
                duration: 300,
                easing: Easing.inOut(Easing.quad),
            });
        }
        // Else if full text is not in view (xPos + width) is not within our
        else if (
            inputData[index].xPos + inputData[index].textWidth >
            width - sScrollTranslateX.value
        ) {
            const endOfTextPosition =
                inputData[index].xPos +
                inputData[index].textWidth +
                styles.container.marginHorizontal * 2;
            const endOfTextOffset = endOfTextPosition - width;

            sScrollTranslateX.value = withTiming(-endOfTextOffset, {
                duration: 300,
                easing: Easing.inOut(Easing.quad),
            });
        }
    };

    const panGesture = Gesture.Pan()
        .activeOffsetX([-5, 5])
        .onStart(() => {
            contextX.value = sScrollTranslateX.value;
        })
        .onUpdate(e => {
            // Disable scroll if no need for it.
            if (derivedScrollOffset.value === 0) {
                return;
            }

            sScrollTranslateX.value = interpolate(
                e.translationX + contextX.value,
                [
                    -derivedScrollOffset.value - 100,
                    -derivedScrollOffset.value - 50,
                    -derivedScrollOffset.value,
                    0,
                    50,
                    100,
                ],
                [
                    -derivedScrollOffset.value - 40,
                    -derivedScrollOffset.value - 25,
                    -derivedScrollOffset.value,
                    0,
                    25,
                    40,
                ],
                {
                    extrapolateRight: Extrapolation.CLAMP,
                    extrapolateLeft: Extrapolation.CLAMP,
                },
            );
        })
        .onFinalize(() => {
            if (sScrollTranslateX.value > 0) {
                sScrollTranslateX.value = withTiming(0, {
                    duration: 300,
                    easing: Easing.inOut(Easing.quad),
                });
            } else if (sScrollTranslateX.value < -derivedScrollOffset.value) {
                sScrollTranslateX.value = withTiming(
                    -derivedScrollOffset.value,
                    {
                        duration: 300,
                        easing: Easing.inOut(Easing.quad),
                    },
                );
            }
        });

    return (
        <>
            <Animated.View style={[styles.container, rScrollStyle]}>
                <GestureDetector gesture={panGesture}>
                    <View>
                        <View style={styles.itemsContainer}>
                            {inputData.map((t, index) => (
                                <Pressable
                                    onPress={() => itemSelection(index)}
                                    key={index}
                                    style={styles.itemContainer}
                                    onLayout={e =>
                                        calculateXPos(
                                            index,
                                            e.nativeEvent.layout.x,
                                        )
                                    }>
                                    <Text
                                        style={[
                                            styles.itemText,
                                            selectedPage === index
                                                ? styles.selectedLabelText
                                                : styles.nonSelectedLabelText,
                                        ]}
                                        onLayout={e =>
                                            calculateTextWidth(
                                                index,
                                                e.nativeEvent.layout.width,
                                            )
                                        }>
                                        {t.title}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                        <Animated.View style={[styles.indicator, rStyle]} />
                    </View>
                </GestureDetector>
            </Animated.View>
            <View style={styles.separator} />
            <View onLayout={() => calculateWithinScrollBounds(true)}>
                {inputData[selectedPage]
                    ? inputData[selectedPage].component
                    : undefined}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 25,
        marginHorizontal: 20,
    },
    itemsContainer: {
        flexDirection: 'row',
        overflow: 'visible',
        paddingBottom: 5,
    },
    itemContainer: {
        marginRight: 25,
    },
    itemText: {
        fontSize: 16,
        fontFamily: 'Jost',
    },
    selectedLabelText: {},
    nonSelectedLabelText: {
        opacity: 0.4,
    },
    indicator: {
        borderBottomWidth: 3,
        borderColor: '#721121',
        zIndex: 5,
    },
    separator: {
        marginHorizontal: 30,
        borderTopWidth: 1,
        borderColor: '#E5E7EB',
        marginTop: -2,
        zIndex: -1,
    },
});
