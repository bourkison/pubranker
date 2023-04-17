import { supabase } from '@/services/supabase';
import { Database } from '@/types/schema';
import React, { useEffect, useState } from 'react';

import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Review from '@/components/Pubs/Review';
import { SelectedPub } from '@/nav/BottomSheetNavigator';
import OverallRatings from '@/components/Ratings/OverallRatings';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setReviews } from '@/store/slices/pub';

type Review = {
    review: Database['public']['Tables']['reviews']['Row'];
    createdBy: Database['public']['Tables']['users_public']['Row'];
};

type PubReviewsProps = {
    pub: SelectedPub;
};

export default function PubReviews({ pub }: PubReviewsProps) {
    const reviews = useAppSelector(state => state.pub.selectedPubReviews);
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);

            const { data, error } = await supabase
                .from('reviews')
                .select()
                .eq('pub_id', pub.id)
                .neq('content', null)
                .neq('content', '')
                .order('created_at', { ascending: false });

            if (error) {
                console.error(error);
                return;
            }

            let promises: Promise<Review['createdBy']>[] = [];

            data.forEach(d => {
                promises.push(
                    new Promise(async (resolve, reject) => {
                        const user = await supabase
                            .from('users_public')
                            .select()
                            .eq('id', d.user_id)
                            .limit(1)
                            .single();

                        if (user.error) {
                            console.error(user.error);
                            return reject(user.error);
                        }

                        resolve(user.data);
                    }),
                );
            });

            let res: Review[] = [];
            const response = await Promise.allSettled(promises);

            response.forEach((a, index) => {
                if (a.status === 'fulfilled') {
                    res.push({ review: data[index], createdBy: a.value });
                }
            });

            dispatch(setReviews(res));
            setIsLoading(false);
        };

        if (!reviews.length) {
            fetchReviews();
        }
    }, [pub, reviews, dispatch]);

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
            {!isLoading ? (
                <View>
                    {reviews.map(review => (
                        <Review
                            review={review}
                            key={review.review.id}
                            pub={pub}
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
