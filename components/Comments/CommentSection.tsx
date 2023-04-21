import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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

    return (
        <View>
            <View>
                {comments.map(comment => (
                    <Comment comment={comment} key={comment.id} />
                ))}
            </View>
            <View style={styles.createCommentContainer}>
                <CreateComment review={review} onCreate={onCreate} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    createCommentContainer: {
        paddingHorizontal: 10,
    },
});
