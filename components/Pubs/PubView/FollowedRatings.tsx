import RatingsStarViewer from '@/components/Ratings/RatingsStarsViewer';
import UserAvatar from '@/components/User/UserAvatar';
import { supabase } from '@/services/supabase';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';

type FollowedRatingsProps = {
    pubId: number;
};

type FollowedRating = {
    id: string;
    username: string;
    profile_photo: string;
    rating: {
        id: number;
        rating: number;
        pub_id: number;
    }[];
};

export default function FollowedRatings({ pubId }: FollowedRatingsProps) {
    const [followedRatings, setFollowedRatings] = useState<FollowedRating[]>(
        [],
    );

    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                console.error(userError);
                return;
            }

            const { data, error } = await supabase
                .from('follows')
                .select(
                    `
                *,
                followed_user:users_public!follows_user_id_fkey!inner(
                    id,
                    username,
                    profile_photo,
                    rating:reviews!inner(
                        id,
                        rating,
                        pub_id
                    )
                )
            `,
                )
                .eq('created_by', userData.user.id)
                .eq('followed_user.rating.pub_id', pubId)
                .limit(15, { referencedTable: 'followed_user' });

            if (error) {
                console.error(error);
                return;
            }

            setFollowedRatings(data.map(d => d.followed_user));
        })();
    }, [pubId]);

    if (!followedRatings.length) {
        return <View />;
    }

    return (
        <>
            <View style={styles.seperator} />
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Rated By</Text>
                </View>

                <View style={styles.scrollableContainer}>
                    <ScrollView
                        horizontal={true}
                        contentContainerStyle={
                            styles.scrollableContentContainer
                        }>
                        {followedRatings.map(followedRating => (
                            <View
                                style={styles.followedRatingContainer}
                                key={followedRating.id}>
                                <Pressable
                                    onPress={() =>
                                        navigation.navigate('Profile', {
                                            userId: followedRating.id,
                                        })
                                    }>
                                    <UserAvatar
                                        photo={followedRating.profile_photo}
                                        size={48}
                                    />
                                </Pressable>
                                <View style={styles.starsContainer}>
                                    <RatingsStarViewer
                                        amount={followedRating.rating[0].rating}
                                        padding={0}
                                        size={12}
                                        color="rgba(0, 0, 0, 0.4)"
                                    />
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 25,
        paddingTop: 15,
    },
    seperator: {
        height: 1,
        marginHorizontal: 30,
        backgroundColor: '#E5E7EB',
    },
    headerContainer: {
        paddingHorizontal: 15,
    },
    headerText: { fontSize: 16, fontFamily: 'Jost' },
    scrollableContainer: {
        marginTop: 17,
    },
    scrollableContentContainer: {
        paddingHorizontal: 15,
    },
    followedRatingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },
});
