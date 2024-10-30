import { fromNowString } from '@/services';
import { UserCommentType } from '@/types';
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    NativeSyntheticEvent,
    TextLayoutEventData,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/services/supabase';

type CommentProps = {
    comment: UserCommentType;
    index: number;
    onLikeToggle?: (index: number, liked: boolean) => void;
};

const MAX_LINES_LENGTH = 4;

export default function Comment({
    comment,
    index,
    onLikeToggle,
}: CommentProps) {
    const [isLiking, setIsLiking] = useState(false);
    const [textShown, setTextShown] = useState(false);
    const [lengthMore, setLengthMore] = useState(false);

    const onTextLayout = useCallback(
        (e: NativeSyntheticEvent<TextLayoutEventData>) => {
            setLengthMore(e.nativeEvent.lines.length >= MAX_LINES_LENGTH);
        },
        [],
    );

    const toggleLike = async () => {
        const userId = (await supabase.auth.getUser()).data.user?.id;

        if (isLiking || !userId) {
            return;
        }

        setIsLiking(true);

        if (comment.liked) {
            await supabase
                .from('comment_likes')
                .delete()
                .eq('comment_id', comment.id)
                .eq('user_id', userId);
        } else {
            await supabase
                .from('comment_likes')
                .insert({ comment_id: comment.id });
        }

        if (onLikeToggle) {
            onLikeToggle(index, !comment.liked);
        }

        setIsLiking(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.createdByText}>{comment.user_name}</Text>
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
                        {comment.liked ? (
                            <Ionicons name="heart" size={14} color="#dc2626" />
                        ) : (
                            <Ionicons
                                name="heart-outline"
                                size={14}
                                color="#a3a3a3"
                            />
                        )}
                    </TouchableOpacity>
                    <Text style={styles.likeText}>
                        {comment.likes_amount} likes
                    </Text>
                </View>
                <View>
                    <Text style={styles.createdAtText}>
                        {fromNowString(comment.created_at)}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderColor: '#E5E7EB',
        borderBottomWidth: 1,
    },
    createdByText: {
        fontWeight: '800',
    },
    contentText: {
        paddingVertical: 5,
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
        color: '#a3a3a3',
        fontWeight: '300',
    },
    createdAtText: {
        color: '#a3a3a3',
        fontWeight: '300',
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
});
