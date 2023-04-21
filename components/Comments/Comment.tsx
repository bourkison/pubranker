import { UserCommentType } from '@/types';
import React from 'react';
import { View, Text } from 'react-native';

type CommentProps = {
    comment: UserCommentType;
};

export default function Comment({ comment }: CommentProps) {
    return (
        <View>
            <Text>{comment.content}</Text>
        </View>
    );
}
