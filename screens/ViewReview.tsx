import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Pressable,
} from 'react-native';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import UserAvatar from '@/components/User/UserAvatar';
import { supabase } from '@/services/supabase';
import { UserReviewType } from '@/types';
import { convertViewToUserReviews } from '@/services';
import RatingsStarViewer from '@/components/Ratings/RatingsStarsViewer';
import dayjs from 'dayjs';
import LikeReviewButton from '@/components/Reviews/LikeReviewButton';

const NO_IMAGE = require('@/assets/noimage.png');

const ASPECT_RATIO = 1.3333;
const WIDTH_PERCENTAGE = 0.33;
const IMAGE_MARGIN = 8;

export default function ViewReview({
    route,
    navigation,
}: StackScreenProps<MainNavigatorStackParamList, 'ViewReview'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [review, setReview] = useState<UserReviewType>();

    const [imageUrl, setImageUrl] = useState('');

    const [contentWidth, setContentWidth] = useState(1);

    const IMAGE_WIDTH = useMemo(
        () => contentWidth * WIDTH_PERCENTAGE,
        [contentWidth],
    );

    useEffect(() => {
        const fetchReview = async () => {
            setIsLoading(true);

            const { data, error } = await supabase
                .from('user_reviews')
                .select()
                .eq('id', route.params.reviewId)
                .limit(1)
                .single();

            setIsLoading(false);

            if (error) {
                console.error(error);
                return;
            }

            if (data.pub_primary_photo) {
                const url = supabase.storage
                    .from('pubs')
                    .getPublicUrl(data.pub_primary_photo);

                setImageUrl(url.data.publicUrl);
            }

            setReview(convertViewToUserReviews(data));
        };

        fetchReview();
    }, [route]);

    const setToLiked = useCallback(() => {
        if (!review) {
            return;
        }

        setReview({
            ...review,
            liked: true,
            likes: review.likes + 1,
        });
    }, [review]);

    const setToUnliked = useCallback(() => {
        if (!review) {
            return;
        }

        setReview({
            ...review,
            liked: false,
            likes: review.likes - 1,
        });
    }, [review]);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (!review) {
        return (
            <View>
                <Text>No review loaded</Text>
            </View>
        );
    }

    return (
        <SafeAreaView>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.settingsContainer}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={14} />
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Review</Text>
                </View>

                <TouchableOpacity style={styles.menuContainer}>
                    <SimpleLineIcons name="options" size={14} />
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                <View
                    onLayout={({
                        nativeEvent: {
                            layout: { width: w },
                        },
                    }) => setContentWidth(w)}>
                    <View
                        style={[
                            styles.pubInfoContainer,
                            {
                                width:
                                    contentWidth -
                                    contentWidth * WIDTH_PERCENTAGE,
                            },
                        ]}>
                        <View style={styles.pubInfoLeftColumn}>
                            <View style={styles.userContainer}>
                                <UserAvatar
                                    photo={review.user_profile_photo}
                                    size={18}
                                />

                                <Text style={styles.usernameText}>
                                    {review.user_name}
                                </Text>
                            </View>

                            <Pressable
                                style={styles.pubNameContainer}
                                onPress={() =>
                                    navigation.push('PubView', {
                                        pubId: review.pub_id,
                                    })
                                }>
                                <Text style={styles.pubNameText}>
                                    {review.pub_name}
                                </Text>

                                <Text style={styles.pubAddressText}>
                                    {review.pub_address}
                                </Text>
                            </Pressable>

                            <View style={styles.ratingsContainer}>
                                <RatingsStarViewer
                                    padding={0}
                                    amount={review.rating}
                                    size={18}
                                />
                            </View>

                            <View style={styles.reviewedAtContainer}>
                                <Text style={styles.reviewedAtText}>
                                    Reviewed{' '}
                                    {dayjs(review.created_at).format(
                                        'D MMM YYYY',
                                    )}
                                </Text>
                            </View>
                        </View>

                        <View
                            style={[
                                styles.pubInfoRightColumn,
                                { width: IMAGE_WIDTH },
                            ]}>
                            <Image
                                source={imageUrl ? { uri: imageUrl } : NO_IMAGE}
                                style={[
                                    styles.pubImage,
                                    {
                                        width: IMAGE_WIDTH,
                                        height: IMAGE_WIDTH / ASPECT_RATIO,
                                    },
                                ]}
                            />
                        </View>
                    </View>

                    <View style={styles.reviewContentContainer}>
                        <Text style={styles.contentText}>{review.content}</Text>
                    </View>

                    <View style={styles.likedContainer}>
                        <LikeReviewButton
                            reviewId={review.id}
                            size={18}
                            liked={review.liked}
                            onLikeCommence={setToLiked}
                            onUnlikeCommence={setToUnliked}
                            onLikeComplete={success =>
                                !success ? setToUnliked : undefined
                            }
                            onUnlikeComplete={success =>
                                !success ? setToLiked : undefined
                            }
                        />
                        <Text style={styles.likedText}>
                            {review.likes}{' '}
                            {review.likes === 1 ? 'like' : 'likes'}
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const ICON_PADDING = 10;

const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    settingsContainer: {
        paddingLeft: ICON_PADDING,
    },
    menuContainer: {
        paddingRight: ICON_PADDING,
    },
    avatarTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
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
    contentContainer: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: '100%',
    },
    pubInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pubInfoLeftColumn: {},
    userContainer: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    usernameText: {
        marginLeft: 5,
        fontWeight: '500',
        fontSize: 14,
    },
    pubNameContainer: {
        marginTop: 15,
    },
    pubNameText: {
        fontWeight: '500',
        fontSize: 18,
    },
    pubAddressText: {
        fontWeight: '300',
        fontSize: 10,
        marginTop: 3,
    },
    ratingsContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    pubInfoRightColumn: {
        width: '100%',
        flex: 1,
        borderRadius: 3,
        justifyContent: 'center',
    },
    pubImage: {
        borderRadius: 3,
        marginLeft: IMAGE_MARGIN,
    },
    reviewedAtContainer: {
        marginTop: 10,
    },
    reviewedAtText: {
        fontSize: 10,
        fontWeight: '200',
    },
    reviewContentContainer: {
        paddingVertical: 20,
    },
    contentText: {},
    likedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likedText: {
        marginLeft: 3,
        fontWeight: '300',
        fontSize: 12,
    },
});
