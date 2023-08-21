import { supabase } from '@/services/supabase';
import React, { useEffect, useState } from 'react';

import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Review from '@/components/Reviews/Review';
import OverallRatings from '@/components/Ratings/OverallRatings';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import ReviewPubButton from '@/components/Reviews/ReviewPubButton';
import { convertUserReviewsToNonNullable } from '@/services';
import { PubSchema, UserReviewType } from '@/types';

type PubReviewsProps = {
    pub: PubSchema;
};

export default function PubReviews({ pub }: PubReviewsProps) {
    const dispatch = useAppDispatch();

    const [reviews, setReviews] = useState<UserReviewType[]>([]);
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

            setReviews(convertedData);
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
                overallReviews={pub.overall_reviews}
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
