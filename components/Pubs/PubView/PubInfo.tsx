import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { distanceString, roundToNearest } from '@/services';
import { GOLD_RATINGS_COLOR } from '@/constants';
import { PubItemType } from '@/components/Pubs/PubItem';

type PubInfoProps = {
    pub: PubItemType;
};

export default function PubInfo({ pub }: PubInfoProps) {
    return (
        <View style={styles.infoContainer}>
            <View style={styles.reviewContainer}>
                <Ionicons name="star" size={12} color={GOLD_RATINGS_COLOR} />
                <Text style={styles.ratingText}>
                    {roundToNearest(pub.rating, 0.1).toFixed(1)}
                </Text>
                <Text style={styles.numReviewsText}>({pub.num_reviews})</Text>
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{pub.name}</Text>
            </View>
            <View style={styles.addressContainer}>
                <Text style={styles.addressText}>{pub.address}</Text>
            </View>
            <View style={styles.distanceContainer}>
                <Text style={styles.distanceText}>
                    {distanceString(pub.dist_meters)}
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
