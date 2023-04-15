import { supabase } from '@/services/supabase';
import { Database } from '@/types/schema';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { StyleSheet, Text, View } from 'react-native';
import Review from '@/components/Pubs/Review';
import { DiscoveredPub, NearbyPub } from '@/types';
import { averageReviews, roundToNearest } from '@/services';
import RatingsBar from '../Utility/RatingsBar';
import RatingsCategory from './RatingsCategory';

type Review = {
    review: Database['public']['Tables']['reviews']['Row'];
    createdBy: Database['public']['Tables']['users_public']['Row'];
};

type SelectedPub = DiscoveredPub | NearbyPub;

type PubReviewsProps = {
    pub: SelectedPub;
};

export default function PubReviews({ pub }: PubReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const { data, error } = await supabase
                .from('reviews')
                .select()
                .eq('pub_id', pub.id)
                .neq('content', null)
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

            setReviews(res);
        };

        fetchReviews();
    }, [pub]);

    return (
        <View>
            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.headerText}>Overall</Text>
                </View>
                <View style={styles.overallRatingsContainer}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.headerText}>
                        {roundToNearest(
                            averageReviews(
                                pub.review_beer,
                                pub.review_food,
                                pub.review_location,
                                pub.review_music,
                                pub.review_service,
                                pub.review_vibe,
                            ),
                            0.1,
                        ).toFixed(1)}
                    </Text>
                </View>
            </View>
            <View style={styles.overallBarContainer}>
                <RatingsBar
                    current={
                        pub.review_beer +
                        pub.review_food +
                        pub.review_location +
                        pub.review_music +
                        pub.review_service +
                        pub.review_vibe
                    }
                    max={30}
                />
            </View>
            <View>
                <View style={styles.ratingsRow}>
                    <View style={[styles.ratingsColumn, styles.rightBorder]}>
                        <RatingsCategory
                            rating={pub.review_beer}
                            title="Beer"
                        />
                    </View>
                    <View style={[styles.ratingsColumn, styles.rightBorder]}>
                        <RatingsCategory
                            rating={pub.review_food}
                            title="Food"
                        />
                    </View>
                    <View style={styles.ratingsColumn}>
                        <RatingsCategory
                            rating={pub.review_location}
                            title="Location"
                        />
                    </View>
                </View>
                <View style={styles.ratingsRow}>
                    <View style={[styles.ratingsColumn, styles.rightBorder]}>
                        <RatingsCategory
                            rating={pub.review_music}
                            title="Music"
                        />
                    </View>
                    <View style={[styles.ratingsColumn, styles.rightBorder]}>
                        <RatingsCategory
                            rating={pub.review_service}
                            title="Service"
                        />
                    </View>
                    <View style={styles.ratingsColumn}>
                        <RatingsCategory
                            rating={pub.review_vibe}
                            title="Vibe"
                        />
                    </View>
                </View>
            </View>
            <View>
                {reviews.map(review => (
                    <Review review={review} key={review.review.id} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    ratingsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#E5E7EB',
        borderBottomWidth: 1,
    },
    ratingsColumn: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        flex: 1,
    },
    rightBorder: {
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
    },
    headerContainer: {
        paddingHorizontal: 29,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: 16,
        fontWeight: '500',
    },
    overallRatingsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    overallBarContainer: {
        paddingHorizontal: 25,
    },
});
