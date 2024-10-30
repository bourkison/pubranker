import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CreateComment from '@/components/Comments/CreateComment';
import { UserCommentType, UserReviewType } from '@/types';
import { supabase } from '@/services/supabase';
import { convertUserCommentsToNonNullable } from '@/services';
import Comment from '@/components/Comments/Comment';

type CommentSectionProps = {
    review: UserReviewType;
};

export default function CommentSection({ review }: CommentSectionProps) {
    const [comments, setComments] = useState<UserCommentType[]>([]);

    useEffect(() => {
        const fetchComments = async () => {
            const { data, error } = await supabase
                .from('user_comments')
                .select()
                .eq('review_id', review.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error(error);
                return;
            }

            setComments(convertUserCommentsToNonNullable(data));
        };

        fetchComments();
    }, [review]);

    const onCreate = (comment: UserCommentType) => {
        setComments([comment, ...comments]);
    };

    const onLikeToggle = (index: number, liked: boolean) => {
        const temp = comments.slice();
        temp[index].liked = !temp[index].liked;

        if (liked) {
            temp[index].likes_amount++;
        } else {
            temp[index].likes_amount--;
        }

        setComments(temp);
    };

    return (
        <View>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Comments</Text>
            </View>
            <View>
                {comments.map((comment, index) => (
                    <Comment
                        comment={comment}
                        key={comment.id}
                        index={index}
                        onLikeToggle={onLikeToggle}
                    />
                ))}
            </View>
            <View style={styles.createCommentContainer}>
                <CreateComment review={review} onCreate={onCreate} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 10,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '500',
    },
    createCommentContainer: {
        paddingHorizontal: 10,
    },
});
