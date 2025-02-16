import { CollectionCommentType } from '@/screens/MainNavigator/CollectionComments';
import { fromNowString } from '@/services';
import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    View,
    Pressable,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import UserAvatar from '@/components/User/UserAvatar';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { supabase } from '@/services/supabase';

type CollectionCommentProps = {
    comment: CollectionCommentType;
    onLike: (isLike: boolean, commentId: number) => void;
};

export default function CollectionComment({
    comment,
    onLike,
}: CollectionCommentProps) {
    const navigation = useNavigation();
    const [isLiking, setIsLiking] = useState(false);

    const toggleLike = useCallback(async () => {
        if (isLiking) {
            return;
        }

        const { error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error(userError);
            return;
        }

        Haptics.impactAsync();
        setIsLiking(true);

        if (!(comment.liked[0].count > 0)) {
            onLike(true, comment.id);

            const { error } = await supabase
                .from('collection_comment_likes')
                .insert({ collection_comment_id: comment.id });

            if (error) {
                console.error(error);
                setIsLiking(false);
                onLike(false, comment.id);
                return;
            }

            setIsLiking(false);
        } else {
            onLike(false, comment.id);

            const { error } = await supabase
                .from('collection_comment_likes')
                .delete()
                .eq('collection_comment_id', comment.id);

            if (error) {
                console.error(error);
                setIsLiking(false);
                onLike(true, comment.id);
                return;
            }

            setIsLiking(false);
        }
    }, [comment, isLiking, onLike]);

    const doubleTap = useCallback(() => {
        if (!(comment.liked[0].count > 0)) {
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
        <View style={styles.commentContainer}>
            <GestureDetector gesture={gesture}>
                <View>
                    <View style={styles.topBarContainer}>
                        <Pressable
                            style={styles.userContainer}
                            onPress={() => {
                                const pushAction = StackActions.push(
                                    'Profile',
                                    {
                                        userId: comment.user.id,
                                    },
                                );
                                navigation.dispatch(pushAction);
                            }}>
                            <View style={styles.avatarContainer}>
                                <UserAvatar
                                    photo={comment.user.profile_photo || ''}
                                    size={24}
                                />
                            </View>
                            <Text style={styles.usernameText}>
                                {comment.user.username}
                            </Text>
                        </Pressable>
                    </View>

                    <View style={styles.contentContainer}>
                        <Text style={styles.contentText}>
                            {comment.content}
                        </Text>
                    </View>

                    <View style={styles.bottomSectionContainer}>
                        <View style={styles.likeSectionContainer}>
                            <TouchableOpacity onPress={toggleLike}>
                                {comment.liked[0].count > 0 ? (
                                    <Ionicons
                                        name="heart"
                                        size={14}
                                        color="#000"
                                    />
                                ) : (
                                    <Ionicons
                                        name="heart-outline"
                                        size={14}
                                        color="#000"
                                    />
                                )}
                            </TouchableOpacity>
                            <Text style={styles.likeText}>
                                {comment.likes[0].count} likes
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
        </View>
    );
}

const styles = StyleSheet.create({
    commentContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 10,
    },
    contentContainer: {
        marginTop: 15,
    },
    topBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    usernameText: {
        fontWeight: '500',
    },
    createdAtText: {
        fontWeight: '300',
        fontSize: 10,
    },
    contentText: {
        fontSize: 14,
    },
    bottomSectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    likeSectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeText: {
        fontWeight: '200',
        fontSize: 12,
        marginLeft: 3,
    },
});
