import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Database } from '@/types/schema';
import { Ionicons } from '@expo/vector-icons';
import { averageReviews, fromNowString, roundToNearest } from '@/services';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetStackParamList } from '@/nav/BottomSheetNavigator';
import { SelectedPub } from '@/store/slices/pub';
import { StackNavigationProp } from '@react-navigation/stack';

export type TReview = {
    review: Database['public']['Tables']['reviews']['Row'];
    createdBy: Database['public']['Tables']['users_public']['Row'];
};

type ReviewProps = {
    review: TReview;
    pub: SelectedPub;
};

export default function Review({ pub, review }: ReviewProps) {
    const navigation =
        useNavigation<StackNavigationProp<BottomSheetStackParamList>>();

    const averageReview = useMemo(() => {
        const r = averageReviews(
            review.review.beer,
            review.review.food,
            review.review.location,
            review.review.music,
            review.review.service,
            review.review.vibe,
        );
        return roundToNearest(r, 0.1).toFixed(1);
    }, [review]);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate('ViewReview', { pub, review })}>
            <View style={styles.contentContainer}>
                <View style={styles.averageReviewContainer}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.averageReviewText}>
                        {averageReview}
                    </Text>
                </View>
                <Text>{review.review.content}</Text>
            </View>
            <View style={styles.nameContainer}>
                <Text style={styles.nameText}>
                    {review.createdBy.name},{' '}
                    {fromNowString(review.review.created_at)}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        borderColor: '#E5E7EB',
        borderBottomWidth: 1,
        paddingHorizontal: 10,
    },
    contentContainer: {},
    averageReviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    averageReviewText: {
        paddingLeft: 3,
        color: '#A3A3A3',
    },
    nameContainer: {},
    nameText: {
        color: '#A3A3A3',
        fontSize: 12,
    },
});
