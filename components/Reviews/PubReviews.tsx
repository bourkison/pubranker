import { supabase } from '@/services/supabase';
import React, { useEffect, useState } from 'react';

import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Review from '@/components/Reviews/Review';
import { SelectedPub } from '@/store/slices/pub';
import OverallRatings from '@/components/Ratings/OverallRatings';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setReviews } from '@/store/slices/pub';
import ReviewPubButton from '@/components/Reviews/ReviewPubButton';
import { convertUserReviewsToNonNullable } from '@/services';

type PubReviewsProps = {
    pub: SelectedPub;
};

export default function PubReviews({ pub }: PubReviewsProps) {
    const dispatch = useAppDispatch();

    const reviews = useAppSelector(state => state.pub.selectedPubReviews);
    const user = useAppSelector(state => state.user.docData);

    const [isLoading, setIsLoading] = useState(false);

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

            const convertedData = convertUserReviewsToNonNullable(data);

            dispatch(setReviews(convertedData));
            setIsLoading(false);
        };

        if (!reviews.length) {
            fetchReviews();
        }
    }, [pub, reviews, dispatch, user]);

    return (
        <View>
            <OverallRatings
                beer={pub.review_beer}
                food={pub.review_food}
                location={pub.review_location}
                music={pub.review_music}
                service={pub.review_service}
                vibe={pub.review_vibe}
                headerText="Ratings"
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
