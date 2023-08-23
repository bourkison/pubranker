import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import OverallRatings from '@/components/Ratings/OverallRatings';
import { supabase } from '@/services/supabase';
import { useAppSelector } from '@/store/hooks';
import { Feather } from '@expo/vector-icons';
import CommentSection from '@/components/Comments/CommentSection';
import { fromNowString } from '@/services';

export default function ViewReview({
    route,
    navigation,
}: StackScreenProps<MainNavigatorStackParamList, 'ViewReview'>) {
    const user = useAppSelector(state => state.user.docData);

    const [isCreatingHelpful, setIsCreatingHelpful] = useState(false);
    const [isHelpfuls, setIsHelpfuls] = useState(
        route.params.review.is_helpfuls,
    );
    const [totalHelpfuls, setTotalHelpfuls] = useState(
        route.params.review.total_helpfuls,
    );

    const deleteReview = async () => {
        const { data } = await supabase
            .from('reviews')
            .delete({})
            .eq('id', route.params.review.id)
            .select();

        if (data && data.length > 0) {
            // Success
            route.params.onDelete();
            navigation.goBack();
        }
    };

    const createHelpful = async (isHelpful: boolean) => {
        if (!user || isCreatingHelpful) {
            return;
        }

        setIsCreatingHelpful(true);

        // Check if already created opposite and thus have to update/toggle already created.
        const { data, error } = await supabase
            .from('review_helpfuls')
            .select()
            .eq('review_id', route.params.review.id)
            .eq('user_id', user.id)
            .limit(1);

        if (error) {
            return;
        }

        if (data.length === 0) {
            await supabase.from('review_helpfuls').insert({
                review_id: route.params.review.id,
                is_helpful: isHelpful,
            });

            route.params.onEdit({
                ...route.params.review,
                total_helpfuls: route.params.review.total_helpfuls + 1,
                is_helpfuls: isHelpful
                    ? route.params.review.is_helpfuls + 1
                    : route.params.review.is_helpfuls,
            });

            if (isHelpful) {
                setIsHelpfuls(isHelpfuls + 1);
            }

            setTotalHelpfuls(totalHelpfuls + 1);
        } else if (data.length === 1 && data[0].is_helpful === !isHelpful) {
            await supabase
                .from('review_helpfuls')
                .update({ is_helpful: isHelpful })
                .eq('review_id', route.params.review.id)
                .eq('user_id', user.id)
                .eq('is_helpful', !isHelpful);

            route.params.onEdit({
                ...route.params.review,
                is_helpfuls: isHelpful
                    ? route.params.review.is_helpfuls + 1
                    : route.params.review.is_helpfuls - 1,
            });

            if (isHelpful) {
                setIsHelpfuls(isHelpfuls + 1);
            } else {
                setIsHelpfuls(isHelpfuls - 1);
            }
        } else {
            await supabase
                .from('review_helpfuls')
                .delete()
                .eq('review_id', route.params.review.id)
                .eq('user_id', user.id);

            route.params.onEdit({
                ...route.params.review,
                total_helpfuls: route.params.review.total_helpfuls - 1,
                is_helpfuls: isHelpful
                    ? route.params.review.is_helpfuls - 1
                    : route.params.review.is_helpfuls,
            });

            if (isHelpful) {
                setIsHelpfuls(isHelpfuls - 1);
            }

            setTotalHelpfuls(totalHelpfuls - 1);
        }

        setIsCreatingHelpful(false);
    };

    return (
        <ScrollView>
            <View>
                <View style={styles.ratingsContainer}>
                    <OverallRatings
                        beer={1}
                        location={1}
                        service={1}
                        vibe={1}
                        music={1}
                        food={1}
                        overallReviews={route.params.review.rating}
                        headerText="Overall"
                    />
                </View>
                <View style={styles.contentContainer}>
                    <Text>{route.params.review.content}</Text>
                </View>
                <View style={styles.bottomSection}>
                    <View style={styles.createdAtContainer}>
                        <Text style={styles.createdAtText}>
                            {fromNowString(route.params.review.created_at)}
                        </Text>
                    </View>
                    <View style={styles.helpfulContainer}>
                        <TouchableOpacity
                            onPress={() => createHelpful(true)}
                            style={styles.helpfulButton}>
                            <Feather
                                name="thumbs-up"
                                size={16}
                                color="#A3A3A3"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => createHelpful(false)}
                            style={styles.helpfulButton}>
                            <Feather
                                name="thumbs-down"
                                size={16}
                                color="#A3A3A3"
                            />
                        </TouchableOpacity>

                        <Text style={styles.helpfulText}>
                            {isHelpfuls} of {totalHelpfuls} found this helpful
                        </Text>
                    </View>
                </View>
                {user && user.id === route.params.review.user_id ? (
                    <View style={styles.buttonsContainer}>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={deleteReview}>
                                <Text style={styles.deleteButtonText}>
                                    Delete
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => console.log('edit')}>
                                <Text style={styles.editButtonText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : undefined}
                <CommentSection review={route.params.review} />
            </View>
        </ScrollView>
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
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 7,
    },
    createdAtContainer: {},
    createdAtText: {
        color: '#a3a3a3',
    },
    helpfulContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    helpfulButton: {
        marginHorizontal: 2,
    },
    helpfulText: {
        color: '#a3a3a3',
    },
});
