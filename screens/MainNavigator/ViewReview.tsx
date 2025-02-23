import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
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
    KeyboardAvoidingView,
    ImageSourcePropType,
} from 'react-native';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import UserAvatar from '@/components/User/UserAvatar';
import { supabase } from '@/services/supabase';
import RatingsStarViewer from '@/components/Ratings/RatingsStarsViewer';
import dayjs from 'dayjs';
import LikeReviewButton from '@/components/Reviews/LikeReviewButton';
import Comment from '@/components/Comments/Comment';
import { HEADER_ICON_SIZE, PRIMARY_COLOR } from '@/constants';
import ReviewAttributes from '@/components/Reviews/ReviewAttributes';
import { reviewQuery, ReviewType } from '@/services/queries/review';
import uuid from 'react-native-uuid';
import { RootStackScreenProps } from '@/types/nav';
import { StackActions } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { useActionSheet } from '@expo/react-native-action-sheet';

const NO_IMAGE = require('@/assets/noimage.png');

type ActionSheetOptions = 'Edit Review' | 'Delete Review' | 'Report' | 'Cancel';

const ASPECT_RATIO = 1;
const WIDTH_PERCENTAGE = 0.3;
const IMAGE_MARGIN = 8;

export default function ViewReview({
    route,
    navigation,
}: RootStackScreenProps<'ViewReview'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [review, setReview] = useState<ReviewType>();
    const [createCommentText, setCreateCommentText] = useState('');
    const [isCreatingComment, setIsCreatingComment] = useState(false);

    const [loggedInUser, setLoggedInUser] = useState<string>();

    const [contentWidth, setContentWidth] = useState(1);

    const { showActionSheetWithOptions } = useActionSheet();

    const inputRef = useRef<TextInput>(null);

    const IMAGE_WIDTH = useMemo(
        () => contentWidth * WIDTH_PERCENTAGE,
        [contentWidth],
    );

    const actionSheetOptions = useMemo<ActionSheetOptions[]>(() => {
        if (!review) {
            return [];
        }

        if (loggedInUser === review.user_id) {
            return ['Edit Review', 'Delete Review', 'Cancel'];
        }

        return ['Report', 'Cancel'];
    }, [review, loggedInUser]);

    const liked = useMemo<boolean>(() => {
        if (!review) {
            return false;
        }

        return review.liked[0].count > 0;
    }, [review]);

    const image = useMemo<ImageSourcePropType>(() => {
        if (!review) {
            return NO_IMAGE;
        }

        if (review.pub.primary_photo) {
            return {
                uri: supabase.storage
                    .from('pubs')
                    .getPublicUrl(review.pub.primary_photo).data.publicUrl,
            };
        }

        return NO_IMAGE;
    }, [review]);

    useEffect(() => {
        const fetchReview = async () => {
            setIsLoading(true);

            const { data: userData } = await supabase.auth.getUser();

            setLoggedInUser(userData.user?.id);

            const { data, error } = await reviewQuery()
                .eq('id', route.params.reviewId)
                // If not logged in, generate random UUID so this shows up as 0.
                .eq('liked.user_id', userData.user?.id || uuid.v4())
                .eq('comments.liked.user_id', userData.user?.id || uuid.v4())
                .order('created_at', {
                    ascending: false,
                    referencedTable: 'comments',
                })
                .limit(1)
                .single();

            setIsLoading(false);

            if (error) {
                console.error(error);
                return;
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
        if (!review) {
            return;
        }

        setIsCreatingComment(true);

        const { data, error } = await supabase
            .from('comments')
            .insert({
                content: createCommentText,
                review_id: review.id,
            })
            .select('*, user:users_public(id, username, profile_photo)')
            .limit(1)
            .single();

        if (error) {
            console.error(error);
            setIsCreatingComment(false);
            return;
        }

        setReview({
            ...review,
            comments: [
                {
                    ...data,
                    liked: [{ count: 0 }],
                    like_amount: [{ count: 0 }],
                },
                ...review.comments,
            ],
        });

        setIsCreatingComment(false);
        setCreateCommentText('');
        inputRef.current?.blur();
    }, [review, createCommentText]);

    const showActionSheet = useCallback(() => {
        showActionSheetWithOptions(
            {
                options: actionSheetOptions,
                cancelButtonIndex: actionSheetOptions.length - 1,
                tintColor: '#000',
                cancelButtonTintColor: '#000',
            },
            selected => {
                if (selected === undefined || !review) {
                    return;
                }

                if (actionSheetOptions[selected] === 'Edit Review') {
                    navigation.navigate('CreateReview', {
                        pubId: review.pub_id,
                    });
                }

                if (actionSheetOptions[selected] === 'Delete Review') {
                    console.log('Delete');
                }

                if (actionSheetOptions[selected] === 'Report') {
                    console.log('Report');
                }
            },
        );
    }, [review, actionSheetOptions, navigation, showActionSheetWithOptions]);

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
                    <Ionicons
                        name="arrow-back-outline"
                        size={HEADER_ICON_SIZE}
                    />
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Review</Text>
                </View>

                <TouchableOpacity
                    style={styles.menuContainer}
                    onPress={showActionSheet}>
                    <SimpleLineIcons name="options" size={HEADER_ICON_SIZE} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={review.comments}
                style={styles.flexOne}
                keyboardDismissMode="on-drag"
                ListEmptyComponent={
                    <View style={styles.noCommentContainer}>
                        <Text style={styles.noCommentText}>No comments</Text>
                    </View>
                }
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
                                            source={image}
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
                            </View>
                        </View>
                        <View style={styles.reviewContentContainer}>
                            <View style={styles.reviewContentTextContainer}>
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

                        <View style={styles.scrollableTagsContainer}>
                            <ReviewAttributes review={review} />
                        </View>
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
            />

            <KeyboardAvoidingView behavior="padding">
                <View style={styles.createCommentContainer}>
                    <View style={styles.commentInputContainer}>
                        <TextInput
                            onSubmitEditing={createComment}
                            ref={inputRef}
                            value={createCommentText}
                            onChangeText={setCreateCommentText}
                            placeholder="Add a comment..."
                            style={styles.commentInput}
                            keyboardType="default"
                            returnKeyType="done"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={createComment}
                        disabled={isCreatingComment}>
                        <Text style={styles.createCommentText}>Comment</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        paddingHorizontal: 15,
    },
    reviewContentTextContainer: {
        marginTop: 15,
    },
    contentText: {},
    likedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 7,
    },
    likedText: {
        marginLeft: 3,
        fontWeight: '300',
        fontSize: 12,
    },
    scrollableTagsContainer: {
        paddingTop: 10,
    },
    createCommentButtonContainer: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    createCommentText: {
        fontWeight: '500',
        marginLeft: 10,
    },
    createCommentContainer: {
        borderTopWidth: 1,
        borderColor: '#E5E7EB',
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    commentInputContainer: {
        flex: 1,
        borderColor: '#E5E7EB',
        borderWidth: 2,
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    commentInput: {
        paddingVertical: 0,
    },
    noCommentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    noCommentText: {
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 12,
    },
});
