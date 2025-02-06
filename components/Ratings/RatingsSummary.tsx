import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AnimatedRatingsBar from '@/components/Ratings/AnimatedRatingsBar';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { roundToNearest } from '@/services';
import RatingsStarViewer from './RatingsStarsViewer';
import * as Haptics from 'expo-haptics';

type RatingsSummaryProps = {
    header: string;
    ratingsHeight: number;
    ratings: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
    ];
    totalRating?: number;
    ratingsPadding?: number;
};

export const BAR_MARGINS = 1;

export default function RatingsSummary({
    header,
    ratings,
    ratingsHeight,
    totalRating,
    ratingsPadding,
}: RatingsSummaryProps) {
    const [largestIndex, setLargestIndex] = useState(0);
    const [elementWidth, setElementWidth] = useState(1);

    const [selected, setSelected] = useState<number | null>(null);

    const barWidth = useMemo(
        () => elementWidth / 10 - BAR_MARGINS * 2,
        [elementWidth],
    );

    const totalBarWidth = useMemo(() => barWidth + BAR_MARGINS * 2, [barWidth]);

    useEffect(() => {
        let largest = 0;

        ratings.forEach((rating, index) => {
            if (rating > ratings[largest]) {
                largest = index;
            }
        });

        setLargestIndex(largest);
    }, [ratings, largestIndex]);

    useEffect(() => {
        if (selected !== null) {
            Haptics.selectionAsync();
        }
    }, [selected]);

    const rightColumnText = useMemo<string>(() => {
        if (selected !== null) {
            return ratings[selected].toString();
        }

        if (!totalRating) {
            return '';
        }

        return roundToNearest(totalRating, 0.1).toFixed(1);
    }, [selected, ratings, totalRating]);

    const calculateRatingsTouch = useCallback<(x: number) => number | null>(
        (x: number) => {
            'worklet';

            for (let i = 0; i < ratings.length; i++) {
                if (x < totalBarWidth * (i + 1)) {
                    return i;
                }
            }

            return null;
        },
        [totalBarWidth, ratings],
    );

    const gesture = Gesture.Pan()
        .failOffsetY([-2, 2])
        .onBegin(e => runOnJS(setSelected)(calculateRatingsTouch(e.x)))
        .onUpdate(e => runOnJS(setSelected)(calculateRatingsTouch(e.x)))
        .onFinalize(() => runOnJS(setSelected)(null));

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{header}</Text>

            <View style={styles.contentContainer}>
                <GestureDetector gesture={gesture}>
                    <View
                        style={[
                            styles.barsContainer,
                            {
                                height: ratingsHeight,
                                padding: ratingsPadding,
                            },
                        ]}
                        onLayout={({
                            nativeEvent: {
                                layout: { width },
                            },
                        }) => setElementWidth(width)}>
                        {ratings.map((r, index) => (
                            <AnimatedRatingsBar
                                val={r}
                                key={index}
                                width={barWidth}
                                maxVal={ratings[largestIndex]}
                                height={ratingsHeight}
                                index={index}
                                selected={selected}
                                setSelected={setSelected}
                                barMargins={BAR_MARGINS}
                            />
                        ))}
                    </View>
                </GestureDetector>

                <View style={styles.rightColumn}>
                    <Text style={styles.starsText}>{rightColumnText}</Text>
                    <View style={styles.starsContainer}>
                        <RatingsStarViewer
                            padding={0}
                            amount={selected === null ? 10 : selected + 1}
                            size={12}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    contentContainer: { flexDirection: 'row' },
    headerText: {
        fontSize: 16,
        fontFamily: 'Jost',
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    barsContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    rightColumn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        width: 55,
        marginTop: -20,
    },
    starsText: {
        fontSize: 18,
        fontFamily: 'Jost',
    },
    starsContainer: {
        flexDirection: 'row',
    },
    star: {},
});
