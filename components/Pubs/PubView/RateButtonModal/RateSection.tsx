import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GOLD_RATINGS_COLOR } from '@/constants';
import { supabase } from '@/services/supabase';
import { PubSchema, UserReviewType } from '@/types';

const STAR_SIZE = 40;
const STAR_PADDING = 4;

type RateSectionProps = {
    pub: PubSchema;
    userReview: UserReviewType | null;
    setUserReview: React.Dispatch<React.SetStateAction<UserReviewType | null>>;
};

export default function RateSection({
    pub,
    userReview,
    setUserReview,
}: RateSectionProps) {
    const [containerWidth, setContainerWidth] = useState(0);

    const rating = useMemo(() => userReview?.rating || 0, [userReview]);

    const updateRating = useCallback(
        (amount: number) => {
            const originalAmount = rating;

            const upsert = async () => {
                const { data: userData, error: userError } =
                    await supabase.auth.getUser();

                if (userError) {
                    console.error(userError);
                    setUserReview(r =>
                        r ? { ...r, rating: originalAmount } : null,
                    );
                    return;
                }

                const { error, data } = await supabase
                    .from('reviews')
                    .upsert(
                        {
                            rating: amount,
                            pub_id: pub.id,
                            user_id: userData.user.id,
                        },
                        { onConflict: 'pub_id, user_id' },
                    )
                    .eq('pub_id', pub.id)
                    .eq('user_id', userData.user.id)
                    .select();

                if (error) {
                    console.error(error);
                    setUserReview(r =>
                        r ? { ...r, rating: originalAmount } : null,
                    );
                }

                if (!userReview && data) {
                    setUserReview(data as UserReviewType);
                }
            };

            setUserReview(r => (r ? { ...r, rating: amount } : null));
            upsert();
        },
        [pub, rating, setUserReview, userReview],
    );

    const calculateStar = useCallback((sel: number, i: number) => {
        // Calc half star first
        if (i * 2 + 1 === sel) {
            return (
                <Ionicons
                    name="star-half-outline"
                    size={STAR_SIZE}
                    color={GOLD_RATINGS_COLOR}
                />
            );
        }

        if (i * 2 < sel) {
            return (
                <Ionicons
                    name="star"
                    size={STAR_SIZE}
                    color={GOLD_RATINGS_COLOR}
                />
            );
        }

        return (
            <Ionicons
                name="star-outline"
                size={STAR_SIZE}
                color={GOLD_RATINGS_COLOR}
            />
        );
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Rate</Text>
            <View style={styles.starsContainer}>
                {Array.from(Array(5)).map((_, index) => (
                    <View
                        key={index}
                        style={styles.starContainer}
                        onLayout={({
                            nativeEvent: {
                                layout: { width },
                            },
                        }) => setContainerWidth(width)}>
                        <Pressable
                            style={[
                                styles.pressableLeft,
                                {
                                    width: containerWidth / 2,
                                    height: STAR_SIZE,
                                },
                            ]}
                            onPress={() => updateRating(index * 2 + 1)}
                        />
                        <Pressable
                            style={[
                                styles.pressableRight,
                                {
                                    width: containerWidth / 2,
                                    height: STAR_SIZE,
                                },
                            ]}
                            onPress={() => updateRating(index * 2 + 2)}
                        />
                        {calculateStar(rating, index)}
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '300',
    },
    starsContainer: {
        flexDirection: 'row',
        position: 'relative',
        paddingVertical: 10,
    },
    starContainer: {
        paddingHorizontal: STAR_PADDING,
    },
    pressableLeft: {
        position: 'absolute',
        left: 0,
        zIndex: 9,
    },
    pressableRight: {
        position: 'absolute',
        right: 0,
        zIndex: 9,
    },
});
