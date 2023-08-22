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

    const sIndicatorTranslateX = useSharedValue(0);
    const sIndicatorWidth = useSharedValue(1);

    const sScrollTranslateX = useSharedValue(0);
    const sScrollOffset = useSharedValue(0); // How far the scroll bar goes off the screen to the right.

    const contextX = useSharedValue(0);

    const rScrollStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: sScrollTranslateX.value }],
    }));

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: sIndicatorTranslateX.value }],
        width: sIndicatorWidth.value,
    }));

    useEffect(() => {
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
    }, [data]);

    const calculateXPos = (index: number, x: number) => {
        if (index === 0) {
            sIndicatorTranslateX.value = x;
        }

        setInputData(d => {
            d[index].xPos = x;
            return d;
        });
    };

    const calculateTextWidth = (index: number, w: number) => {
        if (index === 0) {
            sIndicatorWidth.value = w;
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
        });

        sIndicatorWidth.value = withTiming(inputData[index].textWidth, {
            duration: 350,
        });
    };

    const panGesture = Gesture.Pan()
        .onStart(() => {
            contextX.value = sScrollTranslateX.value;
        })
        .onUpdate(e => {
            sScrollTranslateX.value = interpolate(
                e.translationX + contextX.value,
                [
                    -sScrollOffset.value - 100,
                    -sScrollOffset.value - 50,
                    -sScrollOffset.value,
                    0,
                    50,
                    100,
                ],
                [
                    -sScrollOffset.value - 40,
                    -sScrollOffset.value - 25,
                    -sScrollOffset.value,
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
            } else if (sScrollTranslateX.value < -sScrollOffset.value) {
                sScrollTranslateX.value = withTiming(-sScrollOffset.value, {
                    duration: 300,
                    easing: Easing.inOut(Easing.quad),
                });
            }
        });

    return (
        <>
            <Animated.View
                style={[styles.container, rScrollStyle]}
                onLayout={e => {
                    sScrollOffset.value = Math.max(
                        e.nativeEvent.layout.width - width,
                        0,
                    );
                }}>
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
            {inputData[selectedPage]
                ? inputData[selectedPage].component
                : undefined}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 25,
        marginHorizontal: 10,
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
