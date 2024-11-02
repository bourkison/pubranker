import RatingsSelector from '@/components/Ratings/RatingsSelector';
import { SECONDARY_COLOR } from '@/constants';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { supabase } from '@/services/supabase';
import { Database } from '@/types/schema';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Image,
    useWindowDimensions,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const NO_IMAGE = require('@/assets/noimage.png');

const ASPECT_RATIO = 1.3333;
const WIDTH_PERCENTAGE = 0.2;

const ICON_SIZE = 32;

export default function CreateReview({
    route,
    navigation,
}: StackScreenProps<MainNavigatorStackParamList, 'CreateReview'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [pub, setPub] =
        useState<Database['public']['Tables']['pubs']['Row']>();
    const [imageUrl, setImageUrl] = useState('');

    const [initialSaved, setInitialSaved] = useState(false);
    const [saved, setSaved] = useState(false);

    const [review, setReview] = useState<
        Database['public']['Tables']['reviews']['Insert']
    >({
        pub_id: route.params.pubId,
        content: '',
        rating: 0,
    });

    const { width } = useWindowDimensions();
    const IMAGE_WIDTH = useMemo(() => width * WIDTH_PERCENTAGE, [width]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchPub = () => {
                return new Promise<void>(async (resolve, reject) => {
                    const { data, error } = await supabase
                        .from('pubs')
                        .select()
                        .eq('id', route.params.pubId)
                        .limit(1)
                        .single();

                    if (error) {
                        reject(error);
                        return;
                    }

                    if (data.primary_photo) {
                        const url = supabase.storage
                            .from('pubs')
                            .getPublicUrl(data.primary_photo);

                        setImageUrl(url.data.publicUrl);
                    }

                    setPub(data);
                    resolve();
                });
            };

            const fetchSaved = () => {
                return new Promise<void>(async (resolve, reject) => {
                    const { data: userData, error: userError } =
                        await supabase.auth.getUser();

                    if (userError) {
                        console.error(userError);
                        reject(userError);
                        return;
                    }

                    const { error } = await supabase
                        .from('saves')
                        .select('')
                        .eq('user_id', userData.user.id)
                        .eq('pub_id', route.params.pubId)
                        .limit(1)
                        .single();

                    if (error) {
                        resolve();
                        return;
                    }

                    setInitialSaved(true);
                    setSaved(true);

                    resolve();
                });
            };

            const fetchReview = () => {
                return new Promise<void>(async (resolve, reject) => {
                    const { data: userData, error: userError } =
                        await supabase.auth.getUser();

                    if (userError) {
                        console.error(userError);
                        reject(userError);
                        return;
                    }

                    const { data, error } = await supabase
                        .from('reviews')
                        .select()
                        .eq('pub_id', route.params.pubId)
                        .eq('user_id', userData.user.id)
                        .limit(1)
                        .single();

                    if (error) {
                        resolve();
                        return;
                    }

                    setReview(data);
                    resolve();
                });
            };

            await Promise.allSettled([fetchPub(), fetchSaved(), fetchReview()]);
            setIsLoading(false);
        };

        fetchData();
    }, [route]);

    return (
        <View>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.cancelContainer}
                    onPress={() => navigation.goBack()}>
                    <Text>Cancel</Text>
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Review</Text>
                </View>

                <TouchableOpacity style={styles.saveContainer}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <ActivityIndicator />
            ) : !pub ? (
                <View>
                    <Text>Error on pub load</Text>
                </View>
            ) : (
                <View style={styles.contentContainer}>
                    <View style={styles.pubInfoContainer}>
                        <Image
                            source={imageUrl ? { uri: imageUrl } : NO_IMAGE}
                            style={{
                                width: IMAGE_WIDTH,
                                height: IMAGE_WIDTH / ASPECT_RATIO,
                            }}
                        />

                        <Text style={styles.pubNameText}>{pub.name}</Text>
                    </View>

                    <View style={styles.ratingSaveContainer}>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.rateText}>Rate</Text>

                            <View style={styles.starsContainer}>
                                <RatingsSelector
                                    rating={review.rating}
                                    onRating={amount =>
                                        setReview(r => ({
                                            ...r,
                                            rating: amount,
                                        }))
                                    }
                                    starPadding={1}
                                    starSize={ICON_SIZE}
                                />
                            </View>
                        </View>

                        <View style={styles.favouriteContainer}>
                            <Text style={styles.rateText}>Favourite</Text>

                            <TouchableOpacity
                                style={styles.saveButtonContainer}
                                onPress={() => setSaved(!saved)}>
                                {saved ? (
                                    <Ionicons
                                        name="heart"
                                        size={ICON_SIZE}
                                        color="#dc2626"
                                    />
                                ) : (
                                    <Ionicons
                                        name="heart-outline"
                                        size={ICON_SIZE}
                                        color="#dc2626"
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: 15,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    saveContainer: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    saveText: {
        color: SECONDARY_COLOR,
        fontWeight: 'bold',
    },
    cancelContainer: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Jost',
        textAlign: 'center',
    },
    contentContainer: {},
    pubInfoContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        backgroundColor: '#E5E7EB88',
        borderColor: '#E5E7EB',
    },
    pubNameText: {
        marginLeft: 15,
        fontSize: 15,
        fontWeight: '500',
    },
    ratingSaveContainer: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#E5E7EB',
        borderBottomWidth: 1,
    },
    ratingContainer: {},
    rateText: {
        fontSize: 15,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    starsContainer: {
        flexDirection: 'row',
    },
    saveButtonContainer: {
        alignItems: 'flex-end',
    },
    favouriteContainer: {
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
    },
});
