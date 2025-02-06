import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ProfileTopBarProps = {
    reviews: number;
    followers: number;
    following: number;
};

export default function ProfileTopBar({
    reviews,
    followers,
    following,
}: ProfileTopBarProps) {
    const reviewsText = useMemo<string>(() => {
        if (reviews === 1) {
            return 'Review';
        }

        return 'Reviews';
    }, [reviews]);

    const followersText = useMemo<string>(() => {
        if (followers === 1) {
            return 'Follower';
        }

        return 'Followers';
    }, [followers]);

    return (
        <View style={styles.topBarContainer}>
            <View style={styles.topBarColumn}>
                <View style={styles.topBarValueContainer}>
                    <Text style={styles.topBarValueText}>
                        {reviews.toString()}
                    </Text>
                </View>

                <View style={styles.topBarHeaderContainer}>
                    <Text style={styles.topBarHeaderText}>{reviewsText}</Text>
                </View>
            </View>

            <View style={styles.topBarColumn}>
                <View style={styles.topBarValueContainer}>
                    <Text style={styles.topBarValueText}>
                        {followers.toString()}
                    </Text>
                </View>

                <View style={styles.topBarHeaderContainer}>
                    <Text style={styles.topBarHeaderText}>{followersText}</Text>
                </View>
            </View>

            <View style={styles.topBarColumn}>
                <View style={styles.topBarValueContainer}>
                    <Text style={styles.topBarValueText}>
                        {following.toString()}
                    </Text>
                </View>

                <View style={styles.topBarHeaderContainer}>
                    <Text style={styles.topBarHeaderText}>Following</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topBarContainer: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    activityIndicator: {
        paddingVertical: 14,
    },
    topBarColumn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topBarValueContainer: {},
    topBarValueText: {
        fontSize: 20,
    },
    topBarHeaderContainer: {
        marginTop: 4,
    },
    topBarHeaderText: {
        fontSize: 12,
        fontWeight: '300',
    },
});
