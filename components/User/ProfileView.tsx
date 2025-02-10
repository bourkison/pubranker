import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import UserAvatar from '@/components/User/UserAvatar';
import ProfileTopBar from '@/components/User/ProfileTopBar';
import RatingsSummary from '@/components/Ratings/RatingsSummary';
import { UserType } from '@/services/queries/user';

type ProfileViewProps = {
    user: UserType;
    isLoggedInUser: boolean;
    isFollowed: boolean;
    setIsFollowed: (follow: boolean) => void;
    isFollowingUs: boolean;
    setIsFollowingUs: (follow: boolean) => void;
};

export default function ProfileView({
    user,
    isLoggedInUser,
    isFollowed,
}: ProfileViewProps) {
    return (
        <View>
            <View style={styles.avatarContainer}>
                <UserAvatar
                    photo={user.profile_photo ?? ''}
                    size={64}
                    withShadow={true}
                />

                {!isLoggedInUser && (
                    <View>
                        {!isFollowed ? (
                            <TouchableOpacity style={styles.followButton}>
                                <Text style={styles.followButtonText}>
                                    Follow
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.unfollowButton}>
                                <Text style={styles.unfollowButtonText}>
                                    Unfollow
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>

            <ProfileTopBar
                reviews={user.reviews[0].count}
                followers={user.followers[0].count}
                following={user.following[0].count}
            />

            <View>
                <Text>Favourites</Text>
            </View>

            <View style={styles.ratingsContainer}>
                <RatingsSummary
                    header="Ratings"
                    ratingsHeight={100}
                    ratingsPadding={10}
                    ratings={[
                        user.review_ones[0].count,
                        user.review_twos[0].count,
                        user.review_threes[0].count,
                        user.review_fours[0].count,
                        user.review_fives[0].count,
                        user.review_sixes[0].count,
                        user.review_sevens[0].count,
                        user.review_eights[0].count,
                        user.review_nines[0].count,
                        user.review_tens[0].count,
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    ratingsContainer: {},
    avatarContainer: {
        paddingVertical: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    followButton: {},
    followButtonText: {},
    unfollowButton: {},
    unfollowButtonText: {},
});
