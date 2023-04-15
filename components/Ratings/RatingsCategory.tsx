import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RatingsBar from '../Utility/RatingsBar';
import { Ionicons } from '@expo/vector-icons';
import { roundToNearest } from '@/services';

type RatingsCategoryProps = {
    title: string;
    rating: number;
};

export default function RatingsCategory({
    title,
    rating,
}: RatingsCategoryProps) {
    return (
        <>
            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.individualRatingHeader}>{title}</Text>
                </View>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.individualRatingText}>
                        {roundToNearest(rating, 0.1).toFixed(1)}
                    </Text>
                </View>
            </View>
            <View style={styles.individualBarContainer}>
                <RatingsBar current={rating} max={5} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    ratingContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 14,
        alignContent: 'center',
        paddingBottom: 2,
    },
    individualRatingHeader: {
        color: '#404040',
        fontWeight: '400',
    },
    individualRatingText: {
        color: '#A3A3A3',
        fontWeight: '200',
    },
    individualBarContainer: {
        paddingHorizontal: 10,
        paddingBottom: 5,
        width: '100%',
    },
});
