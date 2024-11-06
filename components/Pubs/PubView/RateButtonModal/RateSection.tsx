import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '@/services/supabase';
import { PubSchema } from '@/types';
import RatingsSelector from '@/components/Ratings/RatingsSelector';
import {
    ListReviewType,
    reviewListQueryString,
} from '@/services/queries/review';

const STAR_SIZE = 40;
const STAR_PADDING = 4;

type RateSectionProps = {
    pub: PubSchema;
    userReview: ListReviewType | null;
    setUserReview: React.Dispatch<React.SetStateAction<ListReviewType | null>>;
};

export default function RateSection({
    pub,
    userReview,
    setUserReview,
}: RateSectionProps) {
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
                    .select(reviewListQueryString)
                    .limit(1)
                    .single();

                if (error) {
                    console.error(error);
                    setUserReview(r =>
                        r ? { ...r, rating: originalAmount } : null,
                    );
                }

                if (!userReview && data) {
                    setUserReview(data);
                }
            };

            setUserReview(r => (r ? { ...r, rating: amount } : null));
            upsert();
        },
        [pub, rating, setUserReview, userReview],
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Rate</Text>
            <View style={styles.starsContainer}>
                <RatingsSelector
                    rating={rating}
                    onRating={updateRating}
                    starPadding={STAR_PADDING}
                    starSize={STAR_SIZE}
                />
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
});
