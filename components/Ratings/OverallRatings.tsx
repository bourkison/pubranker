import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RatingsBar from '@/components/Utility/RatingsBar';
import { averageReviews, roundToNearest } from '@/services';
import { Ionicons } from '@expo/vector-icons';
import RatingsCategory from '@/components/Ratings/RatingsCategory';

type OverallRatingsProp = {
    beer: number;
    food: number;
    location: number;
    music: number;
    service: number;
    vibe: number;

    headerText: string;
};

export default function OverallRatings({
    beer,
    food,
    location,
    music,
    service,
    vibe,
    headerText,
}: OverallRatingsProp) {
    return (
        <>
            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.headerText}>{headerText}</Text>
                </View>
                <View style={styles.overallRatingsContainer}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.headerText}>
                        {roundToNearest(
                            averageReviews(
                                beer,
                                food,
                                location,
                                music,
                                service,
                                vibe,
                            ),
                            0.1,
                        ).toFixed(1)}
                    </Text>
                </View>
            </View>
            <View style={styles.overallBarContainer}>
                <RatingsBar
                    current={beer + food + location + music + service + vibe}
                    max={30}
                />
            </View>
            <View>
                <View style={styles.ratingsRow}>
                    <View style={[styles.ratingsColumn, styles.rightBorder]}>
                        <RatingsCategory rating={beer} title="Beer" />
                    </View>
                    <View style={[styles.ratingsColumn, styles.rightBorder]}>
                        <RatingsCategory rating={food} title="Food" />
                    </View>
                    <View style={styles.ratingsColumn}>
                        <RatingsCategory rating={location} title="Location" />
                    </View>
                </View>
                <View style={styles.ratingsRow}>
                    <View style={[styles.ratingsColumn, styles.rightBorder]}>
                        <RatingsCategory rating={music} title="Music" />
                    </View>
                    <View style={[styles.ratingsColumn, styles.rightBorder]}>
                        <RatingsCategory rating={service} title="Service" />
                    </View>
                    <View style={styles.ratingsColumn}>
                        <RatingsCategory rating={vibe} title="Vibe" />
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    ratingsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#E5E7EB',
        borderBottomWidth: 1,
    },
    ratingsColumn: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        flex: 1,
    },
    rightBorder: {
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
    },
    headerContainer: {
        paddingHorizontal: 29,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: 16,
        fontWeight: '500',
    },

    overallRatingsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    overallBarContainer: {
        paddingHorizontal: 25,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
});
