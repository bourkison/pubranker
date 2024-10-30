import { supabase } from '@/services/supabase';
import React, { useEffect, useState } from 'react';

import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Review from '@/components/Reviews/Review';
import OverallRatings from '@/components/Ratings/OverallRatings';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import ReviewPubButton from '@/components/Reviews/ReviewPubButton';
import { PubSchema, UserReviewType } from '@/types';
import { useSharedPubViewContext } from '@/context/pubViewContext';

type PubReviewsProps = {
    pub: PubSchema;
};

export default function PubReviews({ pub }: PubReviewsProps) {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.docData);

    const [isLoading, setIsLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    const { reviews, setReviews } = useSharedPubViewContext();

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);

            let query = supabase
                .from('user_reviews')
                .select()
                .eq('pub_id', pub.id)
                .neq('content', null)
                .neq('content', '');

            if (user?.id) {
                query = query.neq('user_id', user?.id || '');
            }

            const { data, error } = await query.order('created_at', {
                ascending: false,
            });

            if (error) {
                console.error(error);
                return;
            }

            console.log('reviews', data.length, data);

            setReviews(data as UserReviewType[]);
            setIsLoading(false);
            setHasLoaded(true);
        };

        if (!hasLoaded) {
            fetchReviews();
        }

        // console.log(pub.review_stars_one, pub.review_stars_two);
    }, [pub, reviews, dispatch, user, setIsLoading, setReviews, hasLoaded]);

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
