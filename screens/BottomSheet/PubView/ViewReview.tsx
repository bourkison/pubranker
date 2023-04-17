import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { BottomSheetStackParamList } from '@/nav/BottomSheetNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import OverallRatings from '@/components/Ratings/OverallRatings';
import { supabase } from '@/services/supabase';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAppDispatch } from '@/store/hooks';
import { deleteReview as deleteReviewStore } from '@/store/slices/pub';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

export default function ViewReview({
    route,
    navigation,
}: StackScreenProps<BottomSheetStackParamList, 'ViewReview'>) {
    const dispatch = useAppDispatch();

    const deleteReview = async () => {
        const { data } = await supabase
            .from('reviews')
            .delete({})
            .eq('id', route.params.review.review.id)
            .select();

        if (data && data.length > 0) {
            // Success
            dispatch(deleteReviewStore(route.params.review.review.id));
            navigation.goBack();
        }
    };

    return (
        <BottomSheetScrollView>
            <View style={styles.ratingsContainer}>
                <OverallRatings
                    beer={route.params.review.review.beer}
                    location={route.params.review.review.location}
                    service={route.params.review.review.service}
                    vibe={route.params.review.review.vibe}
                    music={route.params.review.review.music}
                    food={route.params.review.review.food}
                    headerText="Overall"
                />
            </View>
            <View style={styles.contentContainer}>
                <Text>{route.params.review.review.content}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={deleteReview}>
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() =>
                            navigation.navigate('EditReview', {
                                pub: route.params.pub,
                                review: route.params.review,
                            })
                        }>
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheetScrollView>
    );
}

const styles = StyleSheet.create({
    ratingsContainer: {
        marginTop: 10,
    },
    contentContainer: {
        padding: 10,
    },
    buttonsContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    buttonContainer: { width: '40%' },
    deleteButton: {
        borderColor: '#dc2626',
        borderWidth: 2,
        borderRadius: 3,
        paddingVertical: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#dc2626',
        fontWeight: '600',
    },
    editButton: {
        backgroundColor: '#405359',
        borderRadius: 3,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButtonText: {
        color: '#FAFAFA',
        fontWeight: '600',
    },
});
