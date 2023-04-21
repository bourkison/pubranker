import { BottomSheetStackParamList } from '@/nav/BottomSheetNavigator';
import { supabase } from '@/services/supabase';
import { useAppSelector } from '@/store/hooks';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { SelectedPub } from '@/store/slices/pub';
import Review from './Review';
import { UserReviewType } from '@/types';
import { convertUserReviewsToNonNullable } from '@/services';

type ReviewPubButtonProps = {
    pub: SelectedPub;
};

export default function ReviewPubButton({ pub }: ReviewPubButtonProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [review, setReview] = useState<UserReviewType | null>(null);

    const user = useAppSelector(state => state.user.docData);

    const navigation =
        useNavigation<StackNavigationProp<BottomSheetStackParamList>>();

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
                    setReview(convertUserReviewsToNonNullable(data)[0]);
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
            if (review) {
                navigation.navigate('ViewReview', {
                    pub: pub,
                    review: review,
                });
            } else {
                navigation.navigate('CreateReview', { pub });
            }
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
                            Review This Pub
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
        paddingHorizontal: 100,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    reviewButton: {
        backgroundColor: '#2B5256',
        paddingVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    reviewButtonText: {
        color: '#F5F5F5',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
    },
});
