import { fromNowString } from '@/services';
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    NativeSyntheticEvent,
    TextLayoutEventData,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/services/supabase';
import UserAvatar from '../User/UserAvatar';
import * as Haptics from 'expo-haptics';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { ReviewType } from '@/services/queries/review';
import { StackActions, useNavigation } from '@react-navigation/native';

type CommentProps = {
    comment: ReviewType['comments'][number];
    index: number;
    onLikeCommence?: (index: number) => void;
    onLikeComplete?: (index: number, success: boolean) => void;
    onUnlikeCommence?: (index: number) => void;
    onUnlikeComplete?: (index: number, success: boolean) => void;
};

const MAX_LINES_LENGTH = 4;

export default function Comment({
    comment,
    index,
    onLikeCommence,
    onUnlikeCommence,
    onUnlikeComplete,
    onLikeComplete,
}: CommentProps) {
    const [isLiking, setIsLiking] = useState(false);
    const [textShown, setTextShown] = useState(false);
    const [lengthMore, setLengthMore] = useState(false);

    const navigation = useNavigation();

    const onTextLayout = useCallback(
        (e: NativeSyntheticEvent<TextLayoutEventData>) => {
            setLengthMore(e.nativeEvent.lines.length >= MAX_LINES_LENGTH);
        },
        [],
    );

    const toggleLike = useCallback(async () => {
        if (isLiking) {
            return;
        }

        Haptics.impactAsync();
        setIsLiking(true);

        if (comment.liked[0].count > 0) {
            onUnlikeCommence && onUnlikeCommence(index);

            const { error } = await supabase
                .from('comment_likes')
                .delete()
                .eq('comment_id', comment.id);

            if (error) {
                console.error(error);
                setIsLiking(false);
                onUnlikeComplete && onUnlikeComplete(index, false);
                return;
            }

            onUnlikeComplete && onUnlikeComplete(index, true);
        } else {
            onLikeCommence && onLikeCommence(index);

            const { error } = await supabase
                .from('comment_likes')
                .insert({ comment_id: comment.id });

            if (error) {
                console.error(error);
                setIsLiking(false);
                onLikeComplete && onLikeComplete(index, false);
                return;
            }

            onLikeComplete && onLikeComplete(index, true);
        }

        setIsLiking(false);
    }, [
        comment,
        index,
        isLiking,
        onLikeCommence,
        onLikeComplete,
        onUnlikeCommence,
        onUnlikeComplete,
    ]);

    const doubleTap = useCallback(() => {
        if (comment.liked[0].count === 0) {
            toggleLike();
        } else {
            Haptics.impactAsync();
        }
    }, [toggleLike, comment]);

    const gesture = Gesture.Tap()
        .numberOfTaps(2)
        .onStart(() => {
            runOnJS(doubleTap)();
        });

    return (
        <GestureDetector gesture={gesture}>
            <View style={styles.container}>
                <Pressable
                    style={styles.userContainer}
                    onPress={() => {
                        const pushAction = StackActions.push('Profile', {
                            userId: comment.user.id,
                        });
                        navigation.dispatch(pushAction);
                    }}>
                    <UserAvatar
                        photo={comment.user.profile_photo || ''}
                        size={22}
                    />

                    <Text style={styles.usernameText}>
                        {comment.user.username}
                    </Text>
                </Pressable>
                <Text
                    style={styles.contentText}
                    numberOfLines={textShown ? undefined : MAX_LINES_LENGTH}
                    onTextLayout={onTextLayout}>
                    {comment.content}
                </Text>
                {lengthMore ? (
                    <TouchableOpacity
                        onPress={() => setTextShown(!textShown)}
                        style={
                            textShown
                                ? styles.seeLessContainer
                                : styles.seeMoreContainer
                        }>
                        <Text style={styles.toggleTextText}>
                            {textShown ? 'See Less' : '... See More'}
                        </Text>
                    </TouchableOpacity>
                ) : undefined}
                <View style={styles.bottomSectionContainer}>
                    <View style={styles.likeSectionContainer}>
                        <TouchableOpacity
                            style={styles.likeButton}
                            onPress={toggleLike}>
                            {comment.liked[0].count > 0 ? (
                                <Ionicons
                                    name="heart"
                                    size={14}
                                    color="#dc2626"
                                />
                            ) : (
                                <Ionicons
                                    name="heart-outline"
                                    size={14}
                                    color="#a3a3a3"
                                />
                            )}
                        </TouchableOpacity>
                        <Text style={styles.likeText}>
                            {comment.like_amount[0].count} likes
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.createdAtText}>
                            {fromNowString(comment.created_at)}
                        </Text>
                    </View>
                </View>
            </View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderColor: '#E5E7EB',
        borderBottomWidth: 1,
    },
    createdByText: {
        fontWeight: '800',
    },
    contentText: {
        paddingVertical: 15,
        fontSize: 14,
    },
    bottomSectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    likeSectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeButton: {
        marginRight: 4,
    },
    likeText: {
        fontWeight: '200',
        fontSize: 12,
    },
    createdAtText: {
        fontWeight: '200',
        fontSize: 10,
    },
    seeLessContainer: {
        alignSelf: 'flex-end',
    },
    seeMoreContainer: {
        alignSelf: 'flex-end',
        marginTop: -22,
        backgroundColor: 'white',
    },
    toggleTextText: {
        color: '#A3A3A3',
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
});
