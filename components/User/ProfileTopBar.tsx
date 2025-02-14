import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type ProfileTopBarProps = {
    reviews: number;
    followers: number;
    following: number;
    userId: string;
};

export default function ProfileTopBar({
    reviews,
    followers,
    following,
    userId,
}: ProfileTopBarProps) {
    const navigation = useNavigation();

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
            <Pressable
                style={styles.topBarColumn}
                onPress={() =>
                    navigation.navigate('UserReviews', { userId: userId })
                }>
                <View style={styles.topBarValueContainer}>
                    <Text style={styles.topBarValueText}>
                        {reviews.toString()}
                    </Text>
                </View>

                <View style={styles.topBarHeaderContainer}>
                    <Text style={styles.topBarHeaderText}>{reviewsText}</Text>
                </View>
            </Pressable>

            <Pressable
                style={styles.topBarColumn}
                onPress={() => {
                    const pushAction = StackActions.push(
                        'FollowersFollowingView',
                        {
                            userId: userId,
                            type: 'followers',
                            count: followers,
                        },
                    );
                    navigation.dispatch(pushAction);
                }}>
                <View style={styles.topBarValueContainer}>
                    <Text style={styles.topBarValueText}>
                        {followers.toString()}
                    </Text>
                </View>

                <View style={styles.topBarHeaderContainer}>
                    <Text style={styles.topBarHeaderText}>{followersText}</Text>
                </View>
            </Pressable>

            <Pressable
                style={styles.topBarColumn}
                onPress={() => {
                    const pushAction = StackActions.push(
                        'FollowersFollowingView',
                        {
                            userId: userId,
                            type: 'following',
                            count: following,
                        },
                    );
                    navigation.dispatch(pushAction);
                }}>
                <View style={styles.topBarValueContainer}>
                    <Text style={styles.topBarValueText}>
                        {following.toString()}
                    </Text>
                </View>

                <View style={styles.topBarHeaderContainer}>
                    <Text style={styles.topBarHeaderText}>Following</Text>
                </View>
            </Pressable>
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
