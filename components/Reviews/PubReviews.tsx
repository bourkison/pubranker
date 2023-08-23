import { supabase } from '@/services/supabase';
import React, { useEffect } from 'react';

import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Review from '@/components/Reviews/Review';
import OverallRatings from '@/components/Ratings/OverallRatings';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import ReviewPubButton from '@/components/Reviews/ReviewPubButton';
import { PubSchema, UserReviewType } from '@/types';
import { useSharedReviewContext } from '@/context/reviews';

type PubReviewsProps = {
    pub: PubSchema;
};

export default function PubReviews({ pub }: PubReviewsProps) {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.docData);

    const { isLoading, setIsLoading, reviews, setReviews } =
        useSharedReviewContext();

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);

            const { data, error } = await supabase
                .from('user_reviews')
                .select()
                .eq('pub_id', pub.id)
                .neq('content', null)
                .neq('content', '')
                .neq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error(error);
                return;
            }

            console.log('reviews', data.length, reviews.length);

            setReviews(data as UserReviewType[]);
            setIsLoading(false);
        };

        if (!reviews.length) {
            fetchReviews();
        }

        // console.log(pub.review_stars_one, pub.review_stars_two);
    }, [pub, reviews, dispatch, user, setIsLoading, setReviews]);

    return (
        <View>
            <OverallRatings
                rating={pub.rating}
                amountByRating={[
                    pub.review_stars_one,
                    pub.review_stars_two,
                    pub.review_stars_three,
                    pub.review_stars_four,
                    pub.review_stars_five,
                ]}
                ratingsAmount={pub.num_reviews}
            />
            <ReviewPubButton pub={pub} />
            {!isLoading ? (
                <View>
                    {reviews.map(review => (
                        <Review review={review} key={review.id} pub={pub} />
                    ))}
                </View>
            ) : (
                <ActivityIndicator style={styles.activityIndicator} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    activityIndicator: { marginTop: 5 },
});
