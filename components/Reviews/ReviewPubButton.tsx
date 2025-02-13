import { supabase } from '@/services/supabase';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import Review from '@/components/Reviews/Review';
import { useSharedPubViewContext } from '@/context/pubViewContext';
import { PRIMARY_COLOR } from '@/constants';
import { v4 as uuidv4 } from 'uuid';
import { reviewListQuery } from '@/services/queries/review';
import { FetchPubType } from '@/services/queries/pub';

type ReviewPubButtonProps = {
    pub: FetchPubType;
};

export default function ReviewPubButton({ pub }: ReviewPubButtonProps) {
    const [isLoading, setIsLoading] = useState(true);
    const { userReview, setUserReview } = useSharedPubViewContext();

    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            const checkIfReviewed = async () => {
                const { data: userData, error: userError } =
                    await supabase.auth.getUser();

                if (userError) {
                    console.error(userError);
                    setIsLoading(false);
                    return;
                }

                const { data, error } = await reviewListQuery()
                    .eq('pub_id', pub.id)
                    .eq('user_id', userData.user.id)
                    // If not logged in, generate random UUID so this shows up as 0.
                    .eq('liked.user_id', userData.user?.id || uuidv4())
                    .limit(1)
                    .maybeSingle();

                if (error) {
                    console.error(error);
                    setUserReview(null);
                }

                setUserReview(data);

                setIsLoading(false);
            };

            if (!userReview) {
                checkIfReviewed();
            } else {
                setIsLoading(false);
            }
        }, [pub, setUserReview, userReview]),
    );

    const buttonPress = () => {
        if (!isLoading) {
            navigation.navigate('CreateReview', { pubId: pub.id });
        }
    };

    if (isLoading) {
        return <ActivityIndicator />;
    }

    return (
        <View style={styles.container}>
            {userReview && userReview.content ? (
                <Review pub={pub} review={userReview} noBorder={true} />
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
    },
    reviewButton: {
        backgroundColor: PRIMARY_COLOR,
        paddingVertical: 3,
        marginVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    reviewButtonText: {
        color: '#FFF',
        fontSize: 14,
        textAlign: 'center',
    },
});
