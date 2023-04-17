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
import { TReview } from '@/components/Reviews/Review';
import { SelectedPub } from '@/store/slices/pub';
import Review from './Review';

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

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (!user) {
        return <View />;
    }

    return (
        <View style={styles.container}>
            {review ? (
                <Review pub={pub} review={{ review, createdBy: user }} />
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
