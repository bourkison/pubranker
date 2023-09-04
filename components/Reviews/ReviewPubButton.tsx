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
import CreateReview from './CreateReview';
import { useSharedPubViewContext } from '@/context/pubViewContext';

type ReviewPubButtonProps = {
    pub: PubSchema;
};

export default function ReviewPubButton({ pub }: ReviewPubButtonProps) {
    const [isLoading, setIsLoading] = useState(true);
    const { userReview, setUserReview } = useSharedPubViewContext();

    const [createReviewExpanded, setCreateReviewExpanded] = useState(false);

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
                    setUserReview(data[0] as UserReviewType);
                } else {
                    setUserReview(null);
                }

                setIsLoading(false);
            };

            checkIfReviewed();
            // TODO: Update to only check once per pub (i.e. not new loads on tab change).
        }, [pub, user, setUserReview]),
    );

    const buttonPress = () => {
        if (!isLoading && user) {
            setCreateReviewExpanded(true);
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
            {userReview ? (
                <Review pub={pub} review={userReview} />
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
            <CreateReview
                pubId={pub.id}
                expanded={createReviewExpanded}
                onDismiss={() => setCreateReviewExpanded(false)}
            />
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
        backgroundColor: '#292935',
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
