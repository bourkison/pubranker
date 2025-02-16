import { supabase } from '@/services/supabase';
import React, { useEffect, useState } from 'react';

import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Review from '@/components/Reviews/Review';
import { v4 as uuidv4 } from 'uuid';
import { useSharedPubViewContext } from '@/context/pubViewContext';
import { reviewListQuery } from '@/services/queries/review';
import { FetchPubType } from '@/services/queries/pub';

type PubReviewsProps = {
    pub: FetchPubType;
};

const NUM_REVIEWS_TO_SHOW = 10;

export default function PubReviews({ pub }: PubReviewsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const {
        reviews,
        setReviews,
        userReview,
        setUserReview,
        hasLoadedReviews: hasLoaded,
        setHasLoadedReviews: setHasLoaded,
    } = useSharedPubViewContext();

    useEffect(() => {
        const fetchReviews = () =>
            new Promise<void>(async (resolve, reject) => {
                const { data: userData } = await supabase.auth.getUser();

                let query = reviewListQuery()
                    .eq('pub_id', pub.id)
                    // If not logged in, generate random UUID so this shows up as 0.
                    .eq('liked.user_id', userData.user?.id || uuidv4())
                    .neq('content', null)
                    .neq('content', '')
                    .limit(NUM_REVIEWS_TO_SHOW);

                if (userData.user?.id) {
                    query = query.neq('user_id', userData.user?.id || '');
                }

                const { data, error } = await query.order('created_at', {
                    ascending: false,
                });

                if (error) {
                    console.error(error);
                    return reject(error);
                }

                setReviews(data);
                resolve();
            });

        const fetchUserReview = () =>
            new Promise<void>(async (resolve, reject) => {
                const { data: userData, error: userError } =
                    await supabase.auth.getUser();

                if (userError) {
                    console.error(userError);
                    return reject(userError);
                }

                const { data, error } = await reviewListQuery()
                    .eq('pub_id', pub.id)
                    .eq('user_id', userData.user.id)
                    .eq('liked.user_id', userData.user.id)
                    .limit(1)
                    .maybeSingle();

                if (error) {
                    console.error(error);
                    setUserReview(null);
                    return reject(error);
                }

                setUserReview(data);
                resolve();
            });

        if (reviews.length) {
            setHasLoaded(true);
        }

        if (!hasLoaded) {
            (async () => {
                setIsLoading(true);
                await Promise.allSettled([fetchReviews(), fetchUserReview()]);
                setIsLoading(false);
                setHasLoaded(true);
            })();
        }
    }, [pub, reviews, setReviews, setUserReview, hasLoaded, setHasLoaded]);

    return (
        <View>
            {!isLoading ? (
                <View>
                    {userReview && (
                        <Review review={userReview} noBorder={true} />
                    )}
                    {reviews.map((review, index) => (
                        <Review
                            review={review}
                            key={review.id}
                            noBorder={!userReview && index === 0}
                        />
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
