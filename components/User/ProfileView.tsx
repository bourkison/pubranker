import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import UserAvatar from '@/components/User/UserAvatar';
import ProfileTopBar from '@/components/User/ProfileTopBar';
import RatingsSummary from '@/components/Ratings/RatingsSummary';
import { UserType } from '@/services/queries/user';
import { PRIMARY_COLOR } from '@/constants';
import { supabase } from '@/services/supabase';
import ProfileLinks from '@/components/User/ProfileLinks';
import ProfileRecentRatings from '@/components/User/ProfileRecentRatings';
import ProfileFavourites from '@/components/User/ProfileFavourites';

type ProfileViewProps = {
    user: UserType;
    isLoggedInUser: boolean;
    isFollowed: boolean;
    setIsFollowed: (follow: boolean) => void;
    isFollowingUs: boolean;
};

const AVATAR_HEIGHT = 108;

export default function ProfileView({
    user,
    isLoggedInUser,
    isFollowed,
    setIsFollowed,
    isFollowingUs,
}: ProfileViewProps) {
    const [isFollowing, setIsFollowing] = useState(false);

    const follow = useCallback(async () => {
        if (isLoggedInUser) {
            console.warn('Attempting to unfollow logged in user.');
            return;
        }

        setIsFollowing(true);

        const { data, error } = await supabase.auth.getUser();

        if (error) {
            console.error(error);
            setIsFollowing(false);
            return;
        }

        const { error: followError } = await supabase
            .from('follows')
            .insert({ user_id: user.id, created_by: data.user.id });

        if (followError) {
            console.error('Error following user.', followError);
            setIsFollowing(false);
            return;
        }

        setIsFollowing(false);
        setIsFollowed(true);
    }, [isLoggedInUser, user, setIsFollowed]);

    const unfollow = useCallback(async () => {
        if (isLoggedInUser) {
            console.warn('Attempting to unfollow logged in user.');
            return;
        }

        setIsFollowing(true);

        const { data, error } = await supabase.auth.getUser();

        if (error) {
            console.error(error);
            setIsFollowing(false);
            return;
        }

        const { error: unfollowError } = await supabase
            .from('follows')
            .delete()
            .eq('created_by', data.user.id)
            .eq('user_id', user.id);

        if (unfollowError) {
            console.error('Error unfollowing user.', unfollowError);
            setIsFollowing(false);
            return;
        }

        setIsFollowing(false);
        setIsFollowed(false);
    }, [isLoggedInUser, user, setIsFollowed]);

    return (
        <View>
            <View style={styles.followAvatarContainer}>
                <View style={styles.followContainer}>
                    {!isLoggedInUser && (
                        <>
                            {!isFollowed ? (
                                <TouchableOpacity
                                    onPress={follow}
                                    style={styles.followButton}
                                    disabled={isFollowing}>
                                    <Text style={styles.followButtonText}>
                                        Follow
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={unfollow}
                                    style={styles.followButton}
                                    disabled={isFollowing}>
                                    <Text style={styles.followButtonText}>
                                        Unfollow
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {isFollowingUs && (
                                <View style={styles.followsContainer}>
                                    <Text style={styles.followsText}>
                                        Follows you
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
                </View>

                <View style={styles.avatarContainer}>
                    <UserAvatar
                        photo={user.profile_photo ?? ''}
                        size={AVATAR_HEIGHT}
                        withShadow={true}
                    />
                </View>

                <View style={styles.flexOne} />
            </View>

            <View style={styles.nameBioContainer}>
                <View style={styles.nameContainer}>
                    <Text style={styles.nameText}>{user.name}</Text>
                </View>

                {user.bio && (
                    <View style={styles.bioContainer}>
                        <Text style={styles.bioText}>{user.bio}</Text>
                    </View>
                )}
            </View>

            <ProfileTopBar
                userId={user.id}
                reviews={user.reviews[0].count}
                followers={user.followers[0].count}
                following={user.following[0].count}
            />

            {user.favourites.length && (
                <ProfileFavourites favourites={user.favourites} />
            )}

            <ProfileRecentRatings
                recentRatings={user.recent_ratings}
                userId={user.id}
            />

            <View style={styles.ratingsContainer}>
                <RatingsSummary
                    header=""
                    ratingsHeight={80}
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

            <ProfileLinks user={user} />
        </View>
    );
}

const FOLLOW_CONTAINER_MARGIN = 15;

const styles = StyleSheet.create({
    flexOne: { flex: 1 },
    ratingsContainer: {},
    followAvatarContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
    },
    followContainer: {
        flex: 1,
        textAlign: 'right',
        alignItems: 'flex-end',
    },
    avatarContainer: {
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    followButton: {
        borderColor: PRIMARY_COLOR,
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderWidth: 1,
        borderRadius: 2,
        marginRight: FOLLOW_CONTAINER_MARGIN,
        justifyContent: 'center',
        alignItems: 'center',
    },
    followButtonText: {
        fontSize: 10,
        textTransform: 'uppercase',
        fontWeight: '500',
        textAlign: 'center',
    },
    followsContainer: {
        marginTop: 4,
        alignContent: 'flex-end',
        justifyContent: 'flex-end',
        marginRight: FOLLOW_CONTAINER_MARGIN,
    },
    followsText: {
        fontSize: 10,
        textAlign: 'right',
    },
    nameBioContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 20,
    },
    nameContainer: {},
    nameText: {
        fontWeight: '600',
    },
    bioContainer: {
        marginTop: 10,
    },
    bioText: {
        fontSize: 12,
        fontWeight: '400',
    },
});
