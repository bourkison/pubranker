import { GOLD_RATINGS_COLOR } from '@/constants';
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    totalRating: number;
};

type RatingsBarProps = {
    val: number;
    maxVal: number;
    height: number;
    width: number;
    index: number;
    selected: number | null;
    setSelected: React.Dispatch<React.SetStateAction<number | null>>;
};

const MINIMUM_BAR_HEIGHT = 3;
const BAR_MARGINS = 3;

function RatingsBar({
    val,
    maxVal,
    height,
    width,
    index,
    setSelected,
    selected,
}: RatingsBarProps) {
    const h = useMemo(() => {
        if (maxVal === 0) {
            return MINIMUM_BAR_HEIGHT;
        }

        const temp = (val / maxVal) * height;

        return (temp ?? 0) + MINIMUM_BAR_HEIGHT;
    }, [val, maxVal, height]);

    return (
        <Pressable
            style={styles.pressable}
            onPressIn={() => setSelected(index)}
            onPressOut={() => setSelected(null)}>
            <View style={styles.barContainer}>
                <View
                    style={[
                        styles.ratingsBar,
                        { height: h, width },
                        selected === index
                            ? { backgroundColor: GOLD_RATINGS_COLOR }
                            : undefined,
                    ]}
                />
            </View>
        </Pressable>
    );
}

export default function RatingsSummary({
    header,
    ratings,
    ratingsHeight,
    totalRating,
}: RatingsSummaryProps) {
    const [largestIndex, setLargestIndex] = useState(0);
    const [elementWidth, setElementWidth] = useState(1);

    const [selected, setSelected] = useState<number | null>(null);

    const barWidth = useMemo(
        () => elementWidth / 10 - BAR_MARGINS * 2,
        [elementWidth],
    );

    useEffect(() => {
        let largest = 0;

        ratings.forEach((rating, index) => {
            if (rating > ratings[largest]) {
                largest = index;
            }
        });

        setLargestIndex(largest);
    }, [ratings, largestIndex]);

    const rightColumnText = useMemo<string>(() => {
        if (selected === null) {
            return totalRating.toString();
        }

        return ratings[selected].toString();
    }, [selected, ratings, totalRating]);

    const rightColumnStars = useMemo<React.ReactNode>(() => {
        if (selected === null) {
            return (
                <>
                    {Array.from(Array(5)).map(_ => (
                        <Ionicons
                            name="star"
                            style={styles.star}
                            color={GOLD_RATINGS_COLOR}
                            size={12}
                        />
                    ))}
                </>
            );
        }

        return (
            <>
                {Array.from(Array(Math.floor((selected + 1) / 2))).map(_ => (
                    <Ionicons
                        name="star"
                        style={styles.star}
                        color={GOLD_RATINGS_COLOR}
                        size={12}
                    />
                ))}
                {(selected + 1) % 2 === 1 ? (
                    <Ionicons
                        name="star-half"
                        style={styles.star}
                        color={GOLD_RATINGS_COLOR}
                        size={12}
                    />
                ) : undefined}
            </>
        );
    }, [selected]);

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{header}</Text>

            <View style={styles.contentContainer}>
                <View
                    style={styles.barsContainer}
                    onLayout={({
                        nativeEvent: {
                            layout: { width },
                        },
                    }) => setElementWidth(width)}>
                    {ratings.map((r, index) => (
                        <RatingsBar
                            val={r}
                            key={index}
                            width={barWidth}
                            maxVal={ratings[largestIndex]}
                            height={ratingsHeight}
                            index={index}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    ))}
                </View>

                <View style={styles.rightColumn}>
                    <Text style={styles.starsText}>{rightColumnText}</Text>
                    <View style={styles.starsContainer}>
                        {rightColumnStars}
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
    headerText: { fontSize: 16, fontFamily: 'Jost', paddingHorizontal: 15 },
    barsContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    barContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    ratingsBar: {
        backgroundColor: `${GOLD_RATINGS_COLOR}77`,
        marginHorizontal: BAR_MARGINS,
        width: 20,
        borderRadius: 1,
        marginBottom: 4,
    },
    rightColumn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        width: 55,
    },
    starsText: {
        fontSize: 18,
        fontFamily: 'Jost',
    },
    starsContainer: {
        flexDirection: 'row',
    },
    star: {},
    pressable: {
        justifyContent: 'flex-end',
    },
});
