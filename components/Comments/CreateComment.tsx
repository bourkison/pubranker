import React, { useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import Spinner from '@/components/Utility/Spinner';
import { supabase } from '@/services/supabase';
import { UserCommentType, UserReviewType } from '@/types';
import { useAppSelector } from '@/store/hooks';

type CreateCommentProps = {
    review: UserReviewType;
    onCreate?: (comment: UserCommentType) => void;
};

export default function CreateComment({
    review,
    onCreate,
}: CreateCommentProps) {
    const [content, setContent] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const user = useAppSelector(state => state.user.docData);

    const createComment = async () => {
        if (isCreating || !user) {
            return;
        }

        setIsCreating(true);

        const { data, error } = await supabase
            .from('comments')
            .insert({
                content,
                review_id: review.id,
            })
            .select()
            .single();

        setIsCreating(false);

        if (error) {
            console.error(error);
            return;
        }

        setContent('');

        if (onCreate) {
            onCreate({
                ...data,
                user_name: user.name,
                liked: false,
                likes_amount: 0,
            });
        }
    };

    return (
        <View>
            <TextInput
                multiline={true}
                placeholder="Add comment..."
                textAlignVertical="top"
                style={styles.contentInput}
                value={content}
                onChangeText={setContent}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={createComment}>
                    {isCreating ? (
                        <Spinner
                            diameter={16}
                            spinnerWidth={2}
                            backgroundColor="#2B5256"
                            spinnerColor="#f5f5f5"
                        />
                    ) : (
                        <Text style={styles.buttonText}>Comment</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contentInput: {
        height: 96,
        borderColor: '#E5E7EB',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 5,
        marginTop: 10,
        marginBottom: 5,
    },
    buttonContainer: { flexGrow: 0, alignItems: 'flex-end' },
    button: {
        justifyContent: 'flex-end',
        paddingVertical: 5,
        borderRadius: 2,
        backgroundColor: '#2B5256',
        minWidth: 112,
        alignItems: 'center',
    },
    buttonText: {
        color: '#E5E7EB',
        fontWeight: 'bold',
    },
});
