import RatingsSelector from '@/components/Ratings/RatingsSelector';
import { PRIMARY_COLOR } from '@/constants';
import { supabase } from '@/services/supabase';
import { Tables } from '@/types/schema';
import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Image,
    useWindowDimensions,
    TextInput,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '@/types/nav';
import Header from '@/components/Utility/Header';
import * as Haptics from 'expo-haptics';
import ReviewImageUpload, {
    ImageType,
} from '@/components/Reviews/ReviewImageUpload';
import uuid from 'react-native-uuid';
import { decode } from 'base64-arraybuffer';

const NO_IMAGE = require('@/assets/noimage.png');

const ASPECT_RATIO = 1;
const WIDTH_PERCENTAGE = 0.2;

const ICON_SIZE = 32;

export default function CreateReview({
    route,
    navigation,
}: RootStackScreenProps<'CreateReview'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [pub, setPub] = useState<Tables<'pubs'>>();
    const [imageUrl, setImageUrl] = useState('');

    const [initialReviewImagesAmount, setInitialReviewImagesAmount] =
        useState(0);
    const [reviewImages, setReviewImages] = useState<ImageType[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

    const [initialSaved, setInitialSaved] = useState(false);
    const [saved, setSaved] = useState(false);

    const [isCreating, setIsCreating] = useState(false);

    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    const [beer, setBeer] = useState<boolean | null>(null);
    const [vibe, setVibe] = useState<boolean | null>(null);
    const [music, setMusic] = useState<boolean | null>(null);
    const [location, setLocation] = useState<boolean | null>(null);
    const [service, setService] = useState<boolean | null>(null);
    const [food, setFood] = useState<boolean | null>(null);

    const { width } = useWindowDimensions();

    const IMAGE_WIDTH = useMemo(() => width * WIDTH_PERCENTAGE, [width]);

    const beerText = useMemo<string>(() => {
        if (beer === null) {
            return 'Beer?';
        }

        if (beer === false) {
            return 'Bad Beer';
        }

        return 'Good Beer';
    }, [beer]);

    const vibeText = useMemo<string>(() => {
        if (vibe === null) {
            return 'Vibe?';
        }

        if (vibe === false) {
            return 'Bad Vibe';
        }

        return 'Good Vibe';
    }, [vibe]);

    const musicText = useMemo<string>(() => {
        if (music === null) {
            return 'Music?';
        }

        if (music === false) {
            return 'Bad Music';
        }

        return 'Good Music';
    }, [music]);

    const locationText = useMemo<string>(() => {
        if (location === null) {
            return 'Location?';
        }

        if (location === false) {
            return 'Bad Location';
        }

        return 'Good Location';
    }, [location]);

    const serviceText = useMemo<string>(() => {
        if (service === null) {
            return 'Service?';
        }

        if (service === false) {
            return 'Bad Service';
        }

        return 'Good Service';
    }, [service]);

    const foodText = useMemo<string>(() => {
        if (food === null) {
            return 'Food?';
        }

        if (food === false) {
            return 'Bad Food';
        }

        return 'Good Food';
    }, [food]);

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
                        reject(error);
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
                        reject(error);
                        return;
                    }

                    setContent(data.content || '');
                    setRating(data.rating);
                    setBeer(data.beer);
                    setVibe(data.vibe);
                    setLocation(data.location);
                    setMusic(data.music);
                    setService(data.service);
                    setFood(data.food);
                    setReviewImages(
                        data.photos.map(photo => ({
                            id: uuid.v4(),
                            local: false,
                            value: photo,
                        })),
                    );
                    setInitialReviewImagesAmount(data.photos.length);

                    resolve();
                });
            };

            await Promise.allSettled([fetchPub(), fetchSaved(), fetchReview()]);
            setIsLoading(false);
        };

        fetchData();
    }, [route]);

    const saveReview = useCallback(async () => {
        if (!pub) {
            return;
        }

        setIsCreating(true);

        const { data: userData, error: userError } =
            await supabase.auth.getUser();

        if (userError) {
            console.error(userError);
            setIsCreating(false);
            return;
        }

        // First insert the entry.
        const { data, error } = await supabase
            .from('reviews')
            .upsert(
                {
                    content: content.trim(),
                    pub_id: pub.id,
                    rating,
                    beer,
                    vibe,
                    music,
                    service,
                    location,
                    food,
                },
                { onConflict: 'pub_id, user_id' },
            )
            .eq('pub_id', pub.id)
            .eq('user_id', userData.user.id)
            .select()
            .limit(1)
            .single();

        if (error) {
            console.error(error);
            setIsCreating(false);
            return;
        }

        // Next upload any images.
        const uploadImage = (baseString: string) => {
            return new Promise<string>(async (resolve, reject) => {
                const { data: uploadData, error: uploadError } =
                    await supabase.storage
                        .from('reviews')
                        .upload(
                            `${data.id}/${uuid.v4()}.jpeg`,
                            decode(baseString),
                            { contentType: 'image/jpeg' },
                        );

                if (uploadError) {
                    console.error(uploadError);
                    return reject(uploadError);
                }

                resolve(uploadData.path);
            });
        };

        // First upload any local images
        const promises: Promise<string>[] = [];

        reviewImages.forEach(image => {
            if (image.local) {
                promises.push(uploadImage(image.value));
            }
        });

        // Next loop through current array, pushing old keys in if not local
        // or alternatively pushing the new key in when local.
        const keys = await Promise.allSettled(promises);
        const keysToUpsert: string[] = [];
        let i = 0;

        reviewImages.forEach(image => {
            if (!image.local) {
                keysToUpsert.push(image.value);
                return;
            }

            if (keys[i].status === 'fulfilled') {
                // @ts-ignore
                keysToUpsert.push(keys[i].value);
            }

            i++;
        });

        // Next update this review with the images.
        // If we've got keys to upsert, or alternatively have none now but had some at the start.
        if (keysToUpsert.length || initialReviewImagesAmount > 0) {
            const { error: updateError } = await supabase
                .from('reviews')
                .update({
                    photos: keysToUpsert,
                })
                .eq('id', data.id);

            if (updateError) {
                console.error(updateError);
            }
        }

        // Finally delete any images to delete.
        if (imagesToDelete.length) {
            const { error: deleteError } = await supabase.storage
                .from('reviews')
                .remove(imagesToDelete);

            if (deleteError) {
                console.error(deleteError);
            }
        }

        if (initialSaved === false && saved === true) {
            const { error: savesError } = await supabase
                .from('saves')
                .insert({ pub_id: pub.id });

            if (savesError) {
                console.error(savesError);
            }
        } else if (initialSaved === true && saved === false) {
            const { error: savesError } = await supabase
                .from('saves')
                .delete()
                .eq('pub_id', pub.id)
                .eq('user_id', userData.user.id);

            if (savesError) {
                console.error(savesError);
            }
        }

        setIsCreating(false);
        navigation.replace('ViewReview', { reviewId: data.id });
    }, [
        pub,
        saved,
        initialSaved,
        navigation,
        beer,
        content,
        rating,
        vibe,
        music,
        service,
        location,
        food,
        imagesToDelete,
        reviewImages,
        initialReviewImagesAmount,
    ]);

    const toggleAttribute = useCallback(
        (
            attribute: boolean | null,
            setAttribute: Dispatch<SetStateAction<boolean | null>>,
        ) => {
            Haptics.selectionAsync();

            if (attribute === null) {
                setAttribute(true);
                return;
            }

            if (attribute === true) {
                setAttribute(false);
                return;
            }

            setAttribute(null);
        },
        [],
    );

    return (
        <SafeAreaView style={styles.flexOne}>
            <Header
                header="Review"
                leftColumn={
                    <TouchableOpacity
                        style={styles.cancelContainer}
                        onPress={() => navigation.goBack()}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                }
                rightColumn={
                    <TouchableOpacity
                        disabled={isCreating}
                        style={styles.saveContainer}
                        onPress={saveReview}>
                        {isCreating ? (
                            <ActivityIndicator
                                size={15}
                                style={styles.creatingIndicator}
                            />
                        ) : (
                            <Text style={styles.saveText}>Save</Text>
                        )}
                    </TouchableOpacity>
                }
            />

            {isLoading ? (
                <ActivityIndicator />
            ) : !pub ? (
                <View>
                    <Text>Error on pub load</Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.flexOne}
                    bounces={false}
                    keyboardDismissMode="on-drag">
                    <View style={styles.pubInfoContainer}>
                        <Image
                            source={imageUrl ? { uri: imageUrl } : NO_IMAGE}
                            style={[
                                styles.image,
                                {
                                    width: IMAGE_WIDTH,
                                    height: IMAGE_WIDTH / ASPECT_RATIO,
                                },
                            ]}
                        />
                        <View style={styles.pubNameContainer}>
                            <Text style={styles.pubNameText}>{pub.name}</Text>
                            <Text style={styles.pubAddressText}>
                                {pub.address}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.ratingSaveContainer}>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.rateText}>Rate</Text>

                            <View style={styles.starsContainer}>
                                <RatingsSelector
                                    rating={rating}
                                    onRating={setRating}
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

                    <View style={styles.textInputContainer}>
                        <TextInput
                            value={content}
                            onChangeText={setContent}
                            placeholder="Add review..."
                            textAlignVertical="top"
                            multiline={true}
                            style={styles.textInput}
                        />
                    </View>

                    <View style={styles.imageUploadContainer}>
                        <Text style={styles.imageUploadText}>
                            Upload up to 6 photos of the pub.
                        </Text>

                        <ReviewImageUpload
                            images={reviewImages}
                            setImages={setReviewImages}
                            setImagesToDelete={setImagesToDelete}
                        />
                    </View>

                    {/* ATTRIBUTES */}
                    <View style={styles.attributesContainer}>
                        <ScrollView
                            horizontal={true}
                            contentContainerStyle={
                                styles.scrollableAttributesContainer
                            }
                            showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity
                                onPress={() => toggleAttribute(vibe, setVibe)}
                                style={[
                                    styles.generalAttributeContainer,
                                    vibe === null
                                        ? undefined
                                        : vibe === true
                                        ? styles.positiveAttributeContainer
                                        : styles.negativeAttributeContainer,
                                ]}>
                                <Text
                                    style={[
                                        styles.generalAttributeText,
                                        vibe === null
                                            ? undefined
                                            : vibe === true
                                            ? styles.positiveAttributeText
                                            : styles.negativeAttributeText,
                                    ]}>
                                    {vibeText}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => toggleAttribute(beer, setBeer)}
                                style={[
                                    styles.generalAttributeContainer,
                                    beer === null
                                        ? undefined
                                        : beer === true
                                        ? styles.positiveAttributeContainer
                                        : styles.negativeAttributeContainer,
                                ]}>
                                <Text
                                    style={[
                                        styles.generalAttributeText,
                                        beer === null
                                            ? undefined
                                            : beer === true
                                            ? styles.positiveAttributeText
                                            : styles.negativeAttributeText,
                                    ]}>
                                    {beerText}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => toggleAttribute(music, setMusic)}
                                style={[
                                    styles.generalAttributeContainer,
                                    music === null
                                        ? undefined
                                        : music === true
                                        ? styles.positiveAttributeContainer
                                        : styles.negativeAttributeContainer,
                                ]}>
                                <Text
                                    style={[
                                        styles.generalAttributeText,
                                        music === null
                                            ? undefined
                                            : music === true
                                            ? styles.positiveAttributeText
                                            : styles.negativeAttributeText,
                                    ]}>
                                    {musicText}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() =>
                                    toggleAttribute(service, setService)
                                }
                                style={[
                                    styles.generalAttributeContainer,
                                    service === null
                                        ? undefined
                                        : service === true
                                        ? styles.positiveAttributeContainer
                                        : styles.negativeAttributeContainer,
                                ]}>
                                <Text
                                    style={[
                                        styles.generalAttributeText,
                                        service === null
                                            ? undefined
                                            : service === true
                                            ? styles.positiveAttributeText
                                            : styles.negativeAttributeText,
                                    ]}>
                                    {serviceText}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() =>
                                    toggleAttribute(location, setLocation)
                                }
                                style={[
                                    styles.generalAttributeContainer,
                                    location === null
                                        ? undefined
                                        : location === true
                                        ? styles.positiveAttributeContainer
                                        : styles.negativeAttributeContainer,
                                ]}>
                                <Text
                                    style={[
                                        styles.generalAttributeText,
                                        location === null
                                            ? undefined
                                            : location === true
                                            ? styles.positiveAttributeText
                                            : styles.negativeAttributeText,
                                    ]}>
                                    {locationText}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => toggleAttribute(food, setFood)}
                                style={[
                                    styles.generalAttributeContainer,
                                    food === null
                                        ? undefined
                                        : food === true
                                        ? styles.positiveAttributeContainer
                                        : styles.negativeAttributeContainer,
                                ]}>
                                <Text
                                    style={[
                                        styles.generalAttributeText,
                                        food === null
                                            ? undefined
                                            : food === true
                                            ? styles.positiveAttributeText
                                            : styles.negativeAttributeText,
                                    ]}>
                                    {foodText}
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flexOne: {
        flex: 1,
    },
    saveContainer: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    saveText: {
        color: PRIMARY_COLOR,
        fontWeight: 'bold',
    },
    creatingIndicator: { marginLeft: 12, marginRight: 6 },
    cancelContainer: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    pubInfoContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        backgroundColor: '#E5E7EB88',
        borderColor: '#E5E7EB',
    },
    pubNameContainer: {
        marginLeft: 10,
    },
    pubNameText: {
        fontSize: 15,
        fontWeight: '500',
    },
    pubAddressText: {
        fontSize: 10,
        marginTop: 2,
        fontWeight: '300',
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
        fontWeight: '400',
        paddingHorizontal: 5,
        marginBottom: 7,
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
    textInputContainer: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    textInput: {},
    image: {
        borderRadius: 3,
    },
    attributesContainer: {
        paddingVertical: 20,
        borderColor: '#E5E7EB',
        borderTopWidth: 1,
    },
    scrollableAttributesContainer: {
        paddingHorizontal: 15,
    },
    generalAttributeContainer: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 2,
        marginRight: 10,
        borderRadius: 20,
    },
    positiveAttributeContainer: {
        backgroundColor: PRIMARY_COLOR,
        borderColor: PRIMARY_COLOR,
    },
    negativeAttributeContainer: {
        borderColor: PRIMARY_COLOR,
    },
    generalAttributeText: {},
    positiveAttributeText: {
        color: '#fff',
    },
    negativeAttributeText: {
        color: PRIMARY_COLOR,
    },
    imageUploadContainer: {
        paddingVertical: 20,
        borderColor: '#E5E7EB',
        borderTopWidth: 1,
    },
    imageUploadText: {
        fontSize: 12,
        fontWeight: '500',
        paddingHorizontal: 20,
        letterSpacing: -0.2,
        marginBottom: 10,
    },
});
