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
    FlatList,
} from 'react-native';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import UserAvatar from '@/components/User/UserAvatar';
import { supabase } from '@/services/supabase';
import RatingsStarViewer from '@/components/Ratings/RatingsStarsViewer';
import dayjs from 'dayjs';
import LikeReviewButton from '@/components/Reviews/LikeReviewButton';
import Comment from '@/components/Comments/Comment';
import { PRIMARY_COLOR } from '@/constants';
import * as Haptics from 'expo-haptics';
import ReviewAttributes from '@/components/Reviews/ReviewAttributes';
import { reviewQuery, ReviewType } from '@/services/queries/review';
import { v4 as uuidv4 } from 'uuid';
import { RootStackScreenProps } from '@/types/nav';
import { StackActions } from '@react-navigation/native';

const NO_IMAGE = require('@/assets/noimage.png');

const ASPECT_RATIO = 1;
const WIDTH_PERCENTAGE = 0.3;
const IMAGE_MARGIN = 8;

export default function ViewReview({
    route,
    navigation,
}: RootStackScreenProps<'ViewReview'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [review, setReview] = useState<ReviewType>();

    const [imageUrl, setImageUrl] = useState('');

    const [contentWidth, setContentWidth] = useState(1);

    const IMAGE_WIDTH = useMemo(
        () => contentWidth * WIDTH_PERCENTAGE,
        [contentWidth],
    );

    const liked = useMemo<boolean>(() => {
        if (!review) {
            return false;
        }

        return review.liked[0].count > 0;
    }, [review]);

    useEffect(() => {
        const fetchReview = async () => {
            setIsLoading(true);

            const { data: userData } = await supabase.auth.getUser();

            const { data, error } = await reviewQuery()
                .eq('id', route.params.reviewId)
                // If not logged in, generate random UUID so this shows up as 0.
                .eq('liked.user_id', userData.user?.id || uuidv4())
                .eq('comments.liked.user_id', userData.user?.id || uuidv4())
                .limit(1)
                .single();

            setIsLoading(false);

            if (error) {
                console.error(error);
                return;
            }

            if (data.pub.primary_photo) {
                const url = supabase.storage
                    .from('pubs')
                    .getPublicUrl(data.pub.primary_photo);

                setImageUrl(url.data.publicUrl);
            }

            setReview(data);
        };

        fetchReview();
    }, [route]);

    const setToLiked = useCallback(() => {
        if (!review) {
            return;
        }

        setReview({
            ...review,
            liked: [{ count: 1 }],
            like_amount: [{ count: review.like_amount[0].count + 1 }],
        });
    }, [review]);

    const setToUnliked = useCallback(() => {
        if (!review) {
            return;
        }

        setReview({
            ...review,
            liked: [{ count: 0 }],
            like_amount: [{ count: review.like_amount[0].count - 1 }],
        });
    }, [review]);

    const setCommentToLiked = useCallback(
        (index: number) => {
            if (!review || !review.comments[index]) {
                return;
            }

            const updatedComments: ReviewType['comments'] = review.comments.map(
                (comment, i) => {
                    if (index === i) {
                        return {
                            ...comment,
                            liked: [{ count: 1 }],
                            like_amount: [
                                { count: comment.like_amount[0].count + 1 },
                            ],
                        };
                    }

                    return comment;
                },
            );

            setReview({ ...review, comments: updatedComments });
        },
        [review],
    );

    const setCommentToUnliked = useCallback(
        (index: number) => {
            if (!review || !review.comments[index]) {
                return;
            }

            const updatedComments: ReviewType['comments'] = review.comments.map(
                (comment, i) => {
                    if (index === i) {
                        return {
                            ...comment,
                            liked: [{ count: 0 }],
                            like_amount: [
                                { count: comment.like_amount[0].count - 1 },
                            ],
                        };
                    }

                    return comment;
                },
            );

            setReview({ ...review, comments: updatedComments });
        },
        [review],
    );

    const createComment = useCallback(async () => {
        Haptics.selectionAsync();

        navigation.navigate('CreateComment', {
            reviewId: route.params.reviewId,
            onCreate: async comment => {
                if (!review) {
                    console.warn('onCreateComment called with no review');
                    return;
                }

                const { data: userData } = await supabase.auth.getUser();

                if (!userData.user) {
                    console.warn('onCreateComment called with no user');
                    return;
                }

                // TODO: Store this info in store.
                const { data: userPublicData, error: userPublicError } =
                    await supabase
                        .from('users_public')
                        .select('id, name, profile_photo')
                        .eq('id', userData.user.id)
                        .limit(1)
                        .single();

                if (userPublicError) {
                    console.error(userPublicError);
                    return;
                }

                setReview({
                    ...review,
                    comments: [
                        ...review.comments,
                        {
                            ...comment,
                            liked: [{ count: 0 }],
                            like_amount: [{ count: 0 }],
                            user: {
                                id: userData.user.id,
                                name: userPublicData.name,
                                profile_photo: userPublicData.profile_photo,
                            },
                        },
                    ],
                });
            },
        });
    }, [navigation, review, route]);

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
        <SafeAreaView style={styles.flexOne}>
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

            <FlatList
                data={review.comments}
                style={styles.flexOne}
                ListEmptyComponent={
                    <View>
                        <Text>No comments</Text>
                    </View>
                }
                renderItem={({ item, index }) => (
                    <Comment
                        comment={item}
                        index={index}
                        onLikeCommence={setCommentToLiked}
                        onUnlikeCommence={setCommentToUnliked}
                        onLikeComplete={(i, success) =>
                            !success ? setCommentToUnliked(i) : undefined
                        }
                        onUnlikeComplete={(i, success) =>
                            !success ? setCommentToLiked(i) : undefined
                        }
                    />
                )}
                ListHeaderComponent={
                    <View>
                        <View style={styles.contentContainer}>
                            <View
                                style={styles.flexOne}
                                onLayout={({
                                    nativeEvent: {
                                        layout: { width: w },
                                    },
                                }) => setContentWidth(w)}>
                                <View style={[styles.pubInfoContainer]}>
                                    <View style={styles.pubInfoLeftColumn}>
                                        <Pressable
                                            style={styles.userContainer}
                                            onPress={() => {
                                                const pushAction =
                                                    StackActions.push(
                                                        'Profile',
                                                        {
                                                            userId: review.user
                                                                .id,
                                                        },
                                                    );
                                                navigation.dispatch(pushAction);
                                            }}>
                                            <UserAvatar
                                                photo={
                                                    review.user.profile_photo ||
                                                    ''
                                                }
                                                size={24}
                                            />

                                            <Text style={styles.usernameText}>
                                                {review.user.username}
                                            </Text>
                                        </Pressable>

                                        <Pressable
                                            style={styles.pubNameContainer}
                                            onPress={() => {
                                                const pushAction =
                                                    StackActions.push(
                                                        'PubView',
                                                        {
                                                            pubId: review.pub_id,
                                                        },
                                                    );
                                                navigation.dispatch(pushAction);
                                            }}>
                                            <Text style={styles.pubNameText}>
                                                {review.pub.name}
                                            </Text>

                                            <Text style={styles.pubAddressText}>
                                                {review.pub.address}
                                            </Text>
                                        </Pressable>

                                        <View style={styles.ratingsContainer}>
                                            <RatingsStarViewer
                                                padding={0}
                                                amount={review.rating}
                                                size={18}
                                            />
                                        </View>

                                        <View
                                            style={styles.reviewedAtContainer}>
                                            <Text style={styles.reviewedAtText}>
                                                Reviewed{' '}
                                                {dayjs(
                                                    review.created_at,
                                                ).format('D MMM YYYY')}
                                            </Text>
                                        </View>
                                    </View>

                                    <View
                                        style={[
                                            styles.pubInfoRightColumn,
                                            { width: IMAGE_WIDTH },
                                        ]}>
                                        <Image
                                            source={
                                                imageUrl
                                                    ? { uri: imageUrl }
                                                    : NO_IMAGE
                                            }
                                            style={[
                                                styles.pubImage,
                                                {
                                                    width: IMAGE_WIDTH,
                                                    height:
                                                        IMAGE_WIDTH /
                                                        ASPECT_RATIO,
                                                },
                                            ]}
                                        />
                                    </View>
                                </View>

                                <View style={styles.reviewContentContainer}>
                                    <Text style={styles.contentText}>
                                        {review.content}
                                    </Text>
                                </View>

                                <View style={styles.likedContainer}>
                                    <LikeReviewButton
                                        reviewId={review.id}
                                        size={18}
                                        liked={liked}
                                        onLikeCommence={setToLiked}
                                        onUnlikeCommence={setToUnliked}
                                        onLikeComplete={success =>
                                            !success && setToUnliked()
                                        }
                                        onUnlikeComplete={success =>
                                            !success && setToLiked()
                                        }
                                    />
                                    <Text style={styles.likedText}>
                                        {review.like_amount[0].count}{' '}
                                        {review.like_amount[0].count === 1
                                            ? 'like'
                                            : 'likes'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.scrollableTagsContainer}>
                            <ReviewAttributes
                                review={review}
                                withComment={true}
                                onCreateCommentPress={createComment}
                            />
                        </View>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const ICON_PADDING = 10;

const styles = StyleSheet.create({
    flexOne: {
        flex: 1,
    },
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
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        flex: 1,
    },
    pubInfoContainer: {
        flexDirection: 'row',
        width: '100%',
    },
    pubInfoLeftColumn: {
        flex: 1,
        paddingRight: IMAGE_MARGIN,
    },
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
        borderRadius: 3,
        justifyContent: 'center',
    },
    pubImage: {
        borderRadius: 3,
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
    scrollableTagsContainer: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    createCommentButtonContainer: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    createCommentText: {
        fontSize: 12,
        color: '#FFF',
        fontWeight: '500',
    },
});
