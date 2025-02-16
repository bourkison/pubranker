import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native';
import { RootStackScreenProps } from '@/types/nav';
import Header from '@/components/Utility/Header';
import { supabase } from '@/services/supabase';
import { Tables } from '@/types/schema';
import CollectionComment from '@/components/Comments/CollectionComment';
import { v4 as uuidv4 } from 'uuid';

export type CollectionCommentType = Tables<'collection_comments'> & {
    user: {
        id: string;
        username: string;
        profile_photo: string | null;
    };
    likes: { count: number }[];
    liked: { count: number }[];
};

export default function CollectionComments({
    route,
    navigation,
}: RootStackScreenProps<'CollectionComments'>) {
    const [createCommentText, setCreateCommentText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState<CollectionCommentType[]>([]);
    const [isCreatingComment, setIsCreatingComment] = useState(false);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const { data: userData } = await supabase.auth.getUser();

            const { data, error } = await supabase
                .from('collection_comments')
                .select(
                    `
                    *, 
                    user:users_public(id, username, profile_photo), 
                    likes:collection_comment_likes(count),
                    liked:collection_comment_likes(count)
                `,
                )
                .eq('liked.user_id', userData.user?.id || uuidv4())
                .eq('collection_id', route.params.collectionId)
                .order('created_at', { ascending: false });

            if (error) {
                setIsLoading(false);
                console.error(error);
                return;
            }

            setComments(data);
            setIsLoading(false);
        })();
    }, [route]);

    const createComment = useCallback(async () => {
        if (isCreatingComment) {
            return;
        }

        setIsCreatingComment(true);

        const { data, error } = await supabase
            .from('collection_comments')
            .insert({
                collection_id: route.params.collectionId,
                content: createCommentText,
            })
            .select(
                `
                    *, 
                    user:users_public(id, username, profile_photo), 
                    likes:collection_comment_likes(count),
                    liked:collection_comment_likes(count)
                `,
            )
            .limit(1)
            .single();

        if (error) {
            console.error(error);
            setIsCreatingComment(false);
            return;
        }

        setCreateCommentText('');
        inputRef.current?.blur();
        setComments([data, ...comments]);
        setIsCreatingComment(false);
    }, [createCommentText, route, comments, isCreatingComment]);

    const likeComment = useCallback(
        (isLike: boolean, commentId: number) => {
            const temp = comments.slice();
            const index = temp.findIndex(comment => comment.id === commentId);

            if (index === -1) {
                return;
            }

            temp[index].liked[0].count = isLike ? 1 : 0;
            temp[index].likes[0].count += isLike ? 1 : -1;

            setComments(temp);
        },
        [comments],
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header
                header="Comments"
                leftColumn={
                    <TouchableOpacity
                        style={styles.cancelContainer}
                        onPress={() => navigation.goBack()}>
                        <Text>Back</Text>
                    </TouchableOpacity>
                }
                rightColumn={
                    <View style={styles.cancelContainer}>
                        <Text style={styles.hiddenText}>Back</Text>
                    </View>
                }
            />

            <View style={styles.listContainer}>
                <FlatList
                    keyboardDismissMode="on-drag"
                    data={comments}
                    ListEmptyComponent={
                        isLoading ? (
                            <ActivityIndicator />
                        ) : (
                            <View>
                                <Text>No comments.</Text>
                            </View>
                        )
                    }
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <CollectionComment
                            comment={item}
                            onLike={likeComment}
                        />
                    )}
                />
            </View>

            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={64}>
                <View style={styles.createCommentContainer}>
                    <View style={styles.commentInputContainer}>
                        <TextInput
                            onSubmitEditing={createComment}
                            autoFocus={route.params.focusOnOpen}
                            ref={inputRef}
                            value={createCommentText}
                            onChangeText={setCreateCommentText}
                            placeholder="Add a comment..."
                            style={styles.commentInput}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cancelContainer: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'flex-end',
    },
    hiddenText: {
        color: 'transparent',
    },
    listContainer: {
        flex: 1,
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
    createCommentText: {
        fontWeight: '500',
        marginLeft: 10,
    },
    commentInput: {
        paddingVertical: 0,
    },
});
