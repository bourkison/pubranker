import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { BottomSheetStackParamList } from '@/nav/BottomSheetNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import OverallRatings from '@/components/Ratings/OverallRatings';
import { supabase } from '@/services/supabase';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteReview as deleteReviewStore } from '@/store/slices/pub';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';

export default function ViewReview({
    route,
    navigation,
}: StackScreenProps<BottomSheetStackParamList, 'ViewReview'>) {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.docData);

    const deleteReview = async () => {
        const { data } = await supabase
            .from('reviews')
            .delete({})
            .eq('id', route.params.review.id)
            .select();

        if (data && data.length > 0) {
            // Success
            dispatch(deleteReviewStore(route.params.review.id));
            navigation.goBack();
        }
    };

    const createHelpful = async (isHelpful: boolean) => {
        if (!user) {
            return;
        }

        // Check if already created opposite and thus have to update/toggle already created.
        const { count } = await supabase
            .from('review_helpfuls')
            .select('', { head: true, count: 'exact' })
            .eq('review_id', route.params.review.id)
            .eq('user_id', user.id)
            .eq('is_helpful', !isHelpful);

        if (count === 0) {
            await supabase.from('review_helpfuls').insert({
                review_id: route.params.review.id,
                is_helpful: false,
            });
        } else {
            await supabase
                .from('review_helpfuls')
                .update({ is_helpful: isHelpful })
                .eq('review_id', route.params.review.id)
                .eq('user_id', user.id)
                .eq('is_helpful', !isHelpful);
        }
    };

    return (
        <BottomSheetScrollView>
            <View style={styles.ratingsContainer}>
                <OverallRatings
                    beer={route.params.review.beer}
                    location={route.params.review.location}
                    service={route.params.review.service}
                    vibe={route.params.review.vibe}
                    music={route.params.review.music}
                    food={route.params.review.food}
                    headerText="Overall"
                />
            </View>
            <View style={styles.contentContainer}>
                <Text>{route.params.review.content}</Text>
            </View>
            {user && user.id === route.params.review.user_id ? (
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
            ) : (
                <View>
                    <TouchableOpacity onPress={() => createHelpful(true)}>
                        <Feather name="thumbs-up" />
                    </TouchableOpacity>
                </View>
            )}
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
