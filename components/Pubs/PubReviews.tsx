import { supabase } from '@/services/supabase';
import { Database } from '@/types/schema';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

type PubReviewsProps = {
    pubId: number;
};

export default function PubReviews({ pubId }: PubReviewsProps) {
    const [reviews, setReviews] = useState<
        Database['public']['Tables']['reviews']['Row'][]
    >([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const { data, error } = await supabase
                .from('reviews')
                .select()
                .eq('pub_id', pubId)
                .neq('content', null);

            if (error) {
                console.error(error);
                return;
            }

            setReviews(data);
        };

        fetchReviews();
    }, [pubId]);

    return (
        <View>
            {reviews.map(review => (
                <Text>{review.content}</Text>
            ))}
        </View>
    );
}
