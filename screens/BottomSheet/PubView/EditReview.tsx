import StarRanker from '@/components/Utility/StarRanker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { BottomSheetStackParamList } from '@/nav/BottomSheetNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { supabase } from '@/services/supabase';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { editReview } from '@/store/slices/pub';
import { editUserReview } from '@/services';

export default function CreateReview({
    route,
    navigation,
}: StackScreenProps<BottomSheetStackParamList, 'EditReview'>) {
    const [vibe, setVibe] = useState(route.params.review.vibe);
    const [beer, setBeer] = useState(route.params.review.beer);
    const [music, setMusic] = useState(route.params.review.music);
    const [service, setService] = useState(route.params.review.service);
    const [location, setLocation] = useState(route.params.review.location);
    const [food, setFood] = useState(route.params.review.food);
    const [content, setContent] = useState(route.params.review.content);

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.docData);

    const updateReview = async () => {
        setIsLoading(true);

        const { data, error } = await supabase
            .from('reviews')
            .update({
                content,
                beer,
                vibe,
                music,
                service,
                location,
                food,
                pub_id: route.params.pub.id,
            })
            .eq('id', route.params.review.id)
            .select()
            .single();

        setIsLoading(false);

        if (error) {
            // TODO: Handle error
            console.error(error);
            return;
        }

        if (!user) {
            console.warn('No user, navigating to pub');
            navigation.navigate('PubHome', { pubId: route.params.pub.id });
            return;
        }

        const editedReview = editUserReview(data, route.params.review);

        dispatch(editReview(editedReview));
        navigation.navigate('ViewReview', {
            pub: route.params.pub,
            review: editedReview,
        });
    };

    return (
        <BottomSheetScrollView keyboardDismissMode="on-drag">
            <KeyboardAvoidingView behavior="position">
                <View style={styles.contentContainer}>
                    <View style={styles.rankingSection}>
                        <Text style={styles.rankHeader}>Vibe</Text>
                        <View style={styles.rankerContainer}>
                            <StarRanker selected={vibe} setSelected={setVibe} />
                        </View>
                        <Text style={styles.rankHint}>
                            Lighting, other punters chatter, cosiness,
                            temperature, seating, nook availabilty, candles?
                        </Text>
                    </View>

                    <View style={styles.rankingSection}>
                        <Text style={styles.rankHeader}>Beer</Text>
                        <View style={styles.rankerContainer}>
                            <StarRanker selected={beer} setSelected={setBeer} />
                        </View>
                        <Text style={styles.rankHint}>
                            Objectively good selection of beer, how is the pour,
                            temperature, quality.
                        </Text>
                    </View>

                    <View style={styles.rankingSection}>
                        <Text style={styles.rankHeader}>Music</Text>
                        <View style={styles.rankerContainer}>
                            <StarRanker
                                selected={music}
                                setSelected={setMusic}
                            />
                        </View>
                        <Text style={styles.rankHint}>
                            Do you notice the music in a negative or positive
                            way? Does it enhance or detract from the pub
                            experience? Too loud / too quiet? Appropriate
                            bangers? Acoustics
                        </Text>
                    </View>

                    <View style={styles.rankingSection}>
                        <Text style={styles.rankHeader}>Service</Text>
                        <View style={styles.rankerContainer}>
                            <StarRanker
                                selected={service}
                                setSelected={setService}
                            />
                        </View>
                        <Text style={styles.rankHint}>
                            Bar service democratic and timely, also applies to
                            food, demeanour and efficiency and bants
                        </Text>
                    </View>

                    <View style={styles.rankingSection}>
                        <Text style={styles.rankHeader}>Location</Text>
                        <View style={styles.rankerContainer}>
                            <StarRanker
                                selected={location}
                                setSelected={setLocation}
                            />
                        </View>
                        <Text style={styles.rankHint}>
                            Prox to station, high street, bus etc
                        </Text>
                    </View>

                    <View style={styles.rankingSection}>
                        <Text style={styles.rankHeader}>Food</Text>
                        <View style={styles.rankerContainer}>
                            <StarRanker selected={food} setSelected={setFood} />
                        </View>
                        <Text style={styles.rankHint}>
                            Applies to bar snacks through to a la carte. general
                            quality ranking for freshness, taste, inventiveness
                            and seasonality.
                        </Text>
                    </View>

                    <View>
                        <TextInput
                            multiline={true}
                            placeholder="Add some extra information about your time!"
                            textAlignVertical="top"
                            style={styles.contentInput}
                            onChangeText={setContent}
                            value={content}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.postButton}
                    onPress={updateReview}>
                    {isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <Text style={styles.postButtonText}>Update</Text>
                    )}
                </TouchableOpacity>
            </View>
        </BottomSheetScrollView>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        paddingHorizontal: 10,
    },
    rankingSection: {
        paddingVertical: 10,
    },
    rankerContainer: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    rankHeader: {
        fontSize: 16,
    },
    rankHint: {
        fontSize: 10,
        color: '#9CA3AF',
    },
    buttonsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    cancelButton: {
        borderColor: '#2B5256',
        borderWidth: 3,
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        color: '#2B5256',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    postButton: {
        backgroundColor: '#2B5256',
        paddingVertical: 10,
        borderRadius: 3,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    postButtonText: {
        color: '#F5F5F5',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    contentInput: {
        height: 128,
        borderColor: '#E5E7EB',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 5,
        marginTop: 10,
        marginBottom: 25,
    },
});
