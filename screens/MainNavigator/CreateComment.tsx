import { PRIMARY_COLOR } from '@/constants';
import { supabase } from '@/services/supabase';
import { RootStackScreenProps } from '@/types/nav';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    TextInput,
} from 'react-native';

export default function CreateComment({
    navigation,
    route,
}: RootStackScreenProps<'CreateComment'>) {
    const [isCreating, setIsCreating] = useState(false);
    const [content, setContent] = useState('');

    const textInputRef = useRef<TextInput>(null);

    useFocusEffect(() => {
        // TODO: Check if online.

        textInputRef.current?.focus();
    });

    const createComment = useCallback(async () => {
        if (isCreating) {
            return;
        }

        setIsCreating(true);

        const { data, error } = await supabase
            .from('comments')
            .insert({ content, review_id: route.params.reviewId })
            .select()
            .limit(1)
            .single();

        if (error) {
            console.error(error);
            setIsCreating(false);
            return;
        }

        route.params.onCreate(data);
        setIsCreating(false);
        setContent('');
        navigation.goBack();
    }, [isCreating, route, content, navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.cancelContainer}
                    onPress={() => navigation.goBack()}>
                    <Text>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={isCreating}
                    style={styles.saveContainer}
                    onPress={createComment}>
                    {isCreating ? (
                        <ActivityIndicator
                            size={15}
                            style={styles.creatingIndicator}
                        />
                    ) : (
                        <Text style={styles.saveText}>Comment</Text>
                    )}
                </TouchableOpacity>
            </View>

            <TextInput
                value={content}
                onChangeText={setContent}
                multiline={true}
                numberOfLines={5}
                style={styles.textInput}
                placeholder="Comment..."
                ref={textInputRef}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerContainer: {
        paddingVertical: 20,
        paddingHorizontal: 5,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'space-between',
    },
    saveContainer: {
        paddingHorizontal: 10,
    },
    saveText: {
        color: PRIMARY_COLOR,
        fontWeight: '700',
    },
    creatingIndicator: { marginLeft: 12, marginRight: 6 },
    cancelContainer: {
        paddingHorizontal: 10,
        justifyContent: 'flex-end',
    },
    textInput: {
        paddingTop: 15,
        paddingHorizontal: 25,
        flex: 1,
    },
});
