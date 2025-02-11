import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { distanceString, roundToNearest } from '@/services';
import { GOLD_RATINGS_COLOR } from '@/constants';

type PubInfoProps = {
    numReviews: number;
    rating: number;
    distMeters: number;
    name: string;
    address: string;
};

export default function PubInfo({
    numReviews,
    rating,
    distMeters,
    name,
    address,
}: PubInfoProps) {
    return (
        <View style={styles.infoContainer}>
            <View style={styles.reviewContainer}>
                <Ionicons name="star" size={12} color={GOLD_RATINGS_COLOR} />
                <Text style={styles.ratingText}>
                    {roundToNearest(rating, 0.1).toFixed(1)}
                </Text>
                <Text style={styles.numReviewsText}>({numReviews})</Text>
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{name}</Text>
            </View>
            <View style={styles.addressContainer}>
                <Text style={styles.addressText}>{address}</Text>
            </View>
            <View style={styles.distanceContainer}>
                <Text style={styles.distanceText}>
                    {distanceString(distMeters)}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    infoContainer: {
        marginTop: 10,
        paddingHorizontal: 2,
    },
    reviewContainer: {
        flexDirection: 'row',
        alignContent: 'center',
    },
    ratingText: {
        marginLeft: 3,
        color: '#292935',
        fontWeight: '500',
    },
    numReviewsText: {
        marginLeft: 3,
        color: '#292935',
        fontWeight: '200',
    },
    titleContainer: {
        marginTop: 4,
    },
    titleText: {
        fontSize: 16,
        color: '#292935',
        fontWeight: '600',
    },
    addressContainer: {
        marginTop: 4,
    },
    addressText: {
        fontSize: 10,
        color: '#292935',
        fontWeight: '300',
    },
    distanceContainer: {
        marginTop: 4,
    },
    distanceText: {
        fontSize: 10,
        color: '#292935',
        fontWeight: '300',
    },
});
