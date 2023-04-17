import StarRanker from '@/components/Utility/StarRanker';
import React, { useState } from 'react';
import {
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
import { addReview } from '@/store/slices/pub';
import Spinner from '@/components/Utility/Spinner';

export default function CreateReview({
    route,
    navigation,
}: StackScreenProps<BottomSheetStackParamList, 'CreateReview'>) {
    const [vibe, setVibe] = useState(1);
    const [beer, setBeer] = useState(1);
    const [music, setMusic] = useState(1);
    const [service, setService] = useState(1);
    const [location, setLocation] = useState(1);
    const [food, setFood] = useState(1);
    const [content, setContent] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.docData);

    const postReview = async () => {
        setIsLoading(true);

        const { data, error } = await supabase
            .from('reviews')
            .insert({
                content,
                beer,
                vibe,
                music,
                service,
                location,
                food,
                pub_id: route.params.pub.id,
            })
            .select()
            .limit(1)
            .single();

        setIsLoading(false);

        if (error) {
            // TODO: Handle error
            console.error(error);
            return;
        }

        if (!user) {
            console.warn('No user, returning');
            navigation.goBack();
            return;
        }

        dispatch(addReview({ review: data, createdBy: user }));
        navigation.goBack();
    };

    return (
        <BottomSheetScrollView keyboardDismissMode="on-drag">
            <KeyboardAvoidingView behavior="position">
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{route.params.pub.name}</Text>
                </View>
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
                    onPress={postReview}>
                    {isLoading ? (
                        <Spinner
                            diameter={16}
                            spinnerWidth={2}
                            backgroundColor="#2B5256"
                            spinnerColor="#f5f5f5"
                        />
                    ) : (
                        <Text style={styles.postButtonText}>Post</Text>
                    )}
                </TouchableOpacity>
            </View>
        </BottomSheetScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {},
    title: {
        fontWeight: 'bold',
        fontSize: 18,
    },
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
