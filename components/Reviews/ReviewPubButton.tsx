import { supabase } from '@/services/supabase';
import { useAppSelector } from '@/store/hooks';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import Review from './Review';
import { PubSchema, UserReviewType } from '@/types';

type ReviewPubButtonProps = {
    pub: PubSchema;
};

export default function ReviewPubButton({ pub }: ReviewPubButtonProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [review, setReview] = useState<UserReviewType | null>(null);

    const user = useAppSelector(state => state.user.docData);

    useFocusEffect(
        useCallback(() => {
            const checkIfReviewed = async () => {
                if (!user) {
                    return;
                }

                const { data } = await supabase
                    .from('user_reviews')
                    .select()
                    .eq('pub_id', pub.id)
                    .eq('user_id', user.id)
                    .limit(1);

                if (data && data.length) {
                    setReview(data[0] as UserReviewType);
                } else {
                    setReview(null);
                }

                setIsLoading(false);
            };

            checkIfReviewed();
        }, [pub, user]),
    );

    const buttonPress = () => {
        if (!isLoading && user) {
            console.log('button press');
        }
    };

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (!user) {
        return <View />;
    }

    return (
        <View style={styles.container}>
            {review ? (
                <Review pub={pub} review={review} />
            ) : (
                <View style={styles.reviewButtonContainer}>
                    <TouchableOpacity
                        style={styles.reviewButton}
                        onPress={buttonPress}>
                        <Text style={styles.reviewButtonText}>
                            Write Review
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    reviewButtonContainer: {
        paddingHorizontal: 25,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    reviewButton: {
        backgroundColor: '#2B5256',
        paddingVertical: 3,
        borderRadius: 40,
        alignItems: 'center',
    },
    reviewButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Jost',
        textAlign: 'center',
    },
});
