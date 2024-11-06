import { supabase } from '@/services/supabase';
import React, { useEffect, useState } from 'react';

import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Review from '@/components/Reviews/Review';
import { v4 as uuidv4 } from 'uuid';
import ReviewPubButton from '@/components/Reviews/ReviewPubButton';
import { PubSchema } from '@/types';
import { useSharedPubViewContext } from '@/context/pubViewContext';
import { reviewListQuery } from '@/services/queries/review';

type PubReviewsProps = {
    pub: PubSchema;
};

export default function PubReviews({ pub }: PubReviewsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    const { reviews, setReviews } = useSharedPubViewContext();

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);

            const { data: userData } = await supabase.auth.getUser();

            let query = reviewListQuery()
                .eq('pub_id', pub.id)
                // If not logged in, generate random UUID so this shows up as 0.
                .eq('liked.user_id', userData.user?.id || uuidv4())
                .neq('content', null)
                .neq('content', '');

            if (userData.user?.id) {
                query = query.neq('user_id', userData.user?.id || '');
            }

            const { data, error } = await query.order('created_at', {
                ascending: false,
            });

            if (error) {
                console.error(error);
                return;
            }

            console.log('reviews', data.length, JSON.stringify(data));

            // setReviews(data);
            setIsLoading(false);
            setHasLoaded(true);
        };

        if (reviews.length) {
            setHasLoaded(true);
        }

        if (!hasLoaded) {
            fetchReviews();
        }

        // console.log(pub.review_stars_one, pub.review_stars_two);
    }, [pub, reviews, setIsLoading, setReviews, hasLoaded]);

    return (
        <View>
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
