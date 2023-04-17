import { BottomSheetStackParamList } from '@/nav/BottomSheetNavigator';
import { supabase } from '@/services/supabase';
import { useAppSelector } from '@/store/hooks';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TReview } from './Review';
import Spinner from '../Utility/Spinner';
import { SelectedPub } from '@/store/slices/pub';

type ReviewPubButtonProps = {
    pub: SelectedPub;
};

export default function ReviewPubButton({ pub }: ReviewPubButtonProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [review, setReview] = useState<TReview['review'] | null>(null);

    const user = useAppSelector(state => state.user.docData);

    const navigation =
        useNavigation<StackNavigationProp<BottomSheetStackParamList>>();

    useFocusEffect(
        useCallback(() => {
            const checkIfReviewed = async () => {
                const { data } = await supabase
                    .from('reviews')
                    .select()
                    .eq('pub_id', pub.id)
                    .eq('user_id', user?.id)
                    .limit(1)
                    .single();

                if (data) {
                    setReview(data);
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
                    review: { review: review, createdBy: user },
                });
            } else {
                navigation.navigate('CreateReview', { pub });
            }
        }
    };

    return (
        <View style={styles.reviewButtonContainer}>
            <TouchableOpacity style={styles.reviewButton} onPress={buttonPress}>
                {isLoading ? (
                    <Spinner
                        diameter={16}
                        spinnerWidth={2}
                        backgroundColor="#2B5256"
                        spinnerColor="#f5f5f5"
                    />
                ) : (
                    <Text style={styles.reviewButtonText}>
                        {!review ? 'Review This Pub' : 'View Review'}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    reviewButtonContainer: {
        paddingHorizontal: 100,
    },
    reviewButton: {
        backgroundColor: '#2B5256',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    reviewButtonText: {
        color: '#F5F5F5',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
