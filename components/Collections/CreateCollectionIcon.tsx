import React, { useCallback, useRef, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { PRIMARY_COLOR } from '@/constants';
import { supabase } from '@/services/supabase';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SavedNavigatorStackParamList } from '@/nav/SavedNavigator';

export default function CreateCollectionIcon() {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [content, setContent] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const sAnimatedUnderline = useSharedValue(0);
    const navigation =
        useNavigation<StackNavigationProp<SavedNavigatorStackParamList>>();

    const rStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            sAnimatedUnderline.value,
            [0, 1],
            ['#E5E7EB', PRIMARY_COLOR],
        ),
    }));

    const openSheet = useCallback(() => {
        console.log(bottomSheetRef.current);
        bottomSheetRef.current?.present();
    }, []);

    const keyboardBlur = useCallback(() => {
        if (content === '') {
            sAnimatedUnderline.value = withTiming(0);
        }
    }, [content, sAnimatedUnderline]);

    const createReview = useCallback(() => {
        const create = async () => {
            setIsCreating(true);
            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                console.error('cant create user error', userError);
                setIsCreating(false);
                return;
            }

            const { data, error } = await supabase
                .from('collections')
                .insert({ name: content, user_id: userData.user.id })
                .select()
                .limit(1)
                .single();

            setIsCreating(false);

            if (error) {
                console.error(error);
                return;
            }

            bottomSheetRef.current?.dismiss();
            navigation.navigate('CollectionsView', { collectionId: data.id });
        };

        create();
    }, [content, navigation]);

    return (
        <>
            <TouchableOpacity onPress={openSheet}>
                <Feather name="plus" size={18} />
            </TouchableOpacity>
            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={[300]}
                backdropComponent={props => (
                    <BottomSheetBackdrop
                        {...props}
                        pressBehavior="close"
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                        opacity={0.5}
                    />
                )}>
                <View style={styles.bottomSheetContainer}>
                    <View>
                        <Text style={styles.headerText}>List name</Text>
                    </View>

                    <View>
                        <BottomSheetTextInput
                            value={content}
                            onChangeText={setContent}
                            style={styles.textInput}
                            onFocus={() =>
                                (sAnimatedUnderline.value = withTiming(1))
                            }
                            onBlur={keyboardBlur}
                        />

                        <Animated.View style={[rStyle, styles.underline]} />
                    </View>

                    <View>
                        <TouchableOpacity
                            onPress={createReview}
                            style={styles.button}>
                            {isCreating ? (
                                <ActivityIndicator />
                            ) : (
                                <Text style={styles.buttonText}>Create</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheetModal>
        </>
    );
}

const styles = StyleSheet.create({
    bottomSheetContainer: {
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    headerText: {
        fontSize: 18,
    },
    textInput: {
        marginTop: 40,
        paddingVertical: 10,
        paddingHorizontal: 10,
        textAlign: 'center',
        fontSize: 16,
    },
    underline: {
        height: 1,
        borderColor: '#E5E7EB',
    },
    button: {
        marginTop: 40,
        backgroundColor: PRIMARY_COLOR,
        marginHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 3,
        height: 32,
    },
    buttonText: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 12,
    },
});
