import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RatingsBar from '@/components/Utility/RatingsBar';
import { Ionicons } from '@expo/vector-icons';
import { GOLD_RATINGS_COLOR } from '@/constants';
import StarsDisplayer from './StarsDisplayer';
import { roundToNearest } from '@/services';

type OverallRatingsProp = {
    amountByRating: [number, number, number, number, number];
    rating: number;
    ratingsAmount: number;
};

export default function OverallRatings({
    rating,
    amountByRating,
    ratingsAmount,
}: OverallRatingsProp) {
    const highestRatingsAmount = useMemo(
        () => Math.max(...amountByRating),
        [amountByRating],
    );

    if (ratingsAmount === 0) {
        return <></>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.numberedRatingsBarsContainer}>
                {amountByRating
                    .slice()
                    .reverse()
                    .map((numberedRating, index) => (
                        <View
                            style={styles.numberedRatingContainer}
                            key={index}>
                            <Text style={styles.numberText}>{5 - index}</Text>
                            <View style={styles.iconContainer}>
                                <Ionicons
                                    name="star"
                                    size={18}
                                    color={GOLD_RATINGS_COLOR}
                                />
                            </View>
                            <RatingsBar
                                current={numberedRating}
                                max={highestRatingsAmount}
                            />
                        </View>
                    ))}
            </View>
            <View style={styles.totalRatingsContainer}>
                <Text style={styles.ratingText}>
                    {roundToNearest(rating, 0.1).toFixed(1)}
                </Text>
                <View style={styles.starsDisplayerContainer}>
                    <StarsDisplayer size={20} rating={rating} />
                </View>
                <Text style={styles.ratingsAmountText}>
                    {ratingsAmount} review{ratingsAmount === 1 ? '' : 's'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    numberedRatingsBarsContainer: {
        flexDirection: 'column',
        position: 'relative',
        flex: 2,
    },
    numberedRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5,
    },
    totalRatingsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    numberText: {
        fontFamily: 'Jost',
        fontSize: 14,
    },
    iconContainer: {
        marginHorizontal: 5,
    },
    ratingText: {
        fontSize: 42,
        fontFamily: 'Jost',
        marginBottom: -5,
    },
    starsDisplayerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    ratingsAmountText: {
        fontFamily: 'Jost',
        paddingTop: 3,
    },
});
