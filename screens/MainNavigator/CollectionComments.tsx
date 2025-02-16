import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Pressable,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native';
import { RootStackScreenProps } from '@/types/nav';
import Header from '@/components/Utility/Header';
import { supabase } from '@/services/supabase';
import { Tables } from '@/types/schema';
import UserAvatar from '@/components/User/UserAvatar';
import { fromNowString } from '@/services';

type CollectionComment = Tables<'collection_comments'> & {
    user: {
        id: string;
        username: string;
        profile_photo: string | null;
    };
};

export default function CollectionComments({
    route,
    navigation,
}: RootStackScreenProps<'CollectionComments'>) {
    const [createCommentText, setCreateCommentText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState<CollectionComment[]>([]);
    const [isCreatingComment, setIsCreatingComment] = useState(false);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const { data, error } = await supabase
                .from('collection_comments')
                .select('*, user:users_public(id, username, profile_photo)')
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
            .select('*, user:users_public(id, username, profile_photo)')
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
                        <View style={styles.commentContainer}>
                            <View style={styles.topBarContainer}>
                                <Pressable
                                    style={styles.userContainer}
                                    onPress={() =>
                                        navigation.navigate('Profile', {
                                            userId: item.user.id,
                                        })
                                    }>
                                    <View style={styles.avatarContainer}>
                                        <UserAvatar
                                            photo={
                                                item.user.profile_photo || ''
                                            }
                                            size={24}
                                        />
                                    </View>
                                    <Text style={styles.usernameText}>
                                        {item.user.username}
                                    </Text>
                                </Pressable>
                                <View>
                                    <Text style={styles.createdAtText}>
                                        {fromNowString(item.created_at)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.contentContainer}>
                                <Text style={styles.contentText}>
                                    {item.content}
                                </Text>
                            </View>
                        </View>
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
    commentContainer: {
        paddingHorizontal: 10,
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
        marginLeft: 34,
        marginTop: 10,
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
        fontSize: 12,
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
        borderWidth: 1,
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
