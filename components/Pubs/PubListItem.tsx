import { supabase } from '@/services/supabase';
import { PubSchema } from '@/types';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Pressable,
    Image,
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import PubInfo from '@/components/Pubs/PubView/PubInfo';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPubSave } from '@/store/slices/explore';

const NO_IMAGE = require('@/assets/noimage.png');
const WIDTH_PERCENTAGE = 0.8;
const ASPECT_RATIO = 1.3333; // 4:3

type PubListItemProps = {
    pub: PubSchema;
    onSaveToggle?: (id: number, value: boolean) => void;
};

export default function PubListItem({ pub, onSaveToggle }: PubListItemProps) {
    const [imageUrl, setImageUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const user = useAppSelector(state => state.user.docData);
    const dispatch = useAppDispatch();

    const { width } = useWindowDimensions();
    const COMPONENT_WIDTH = width * WIDTH_PERCENTAGE;

    const navigation =
        useNavigation<StackNavigationProp<MainNavigatorStackParamList>>();

    useEffect(() => {
        if (pub.photos[0]) {
            console.log('photos', pub.photos[0], NO_IMAGE);

            const url = supabase.storage
                .from('pubs')
                .getPublicUrl(pub.photos[0]);

            console.log('url', url);

            setImageUrl(url.data.publicUrl);
        }
    }, [pub]);

    const toggleLike = useCallback(async () => {
        if (!user || isSaving) {
            return;
        }

        setIsSaving(true);

        if (!pub.saved) {
            if (onSaveToggle) {
                onSaveToggle(pub.id, true);
            }

            const { error } = await supabase.from('saves').insert({
                pub_id: pub.id,
            });

            setIsSaving(false);

            if (!error) {
                dispatch(setPubSave({ id: pub.id, value: true }));
            } else {
                if (onSaveToggle) {
                    onSaveToggle(pub.id, false);
                }

                console.error(error);
            }
        } else {
            if (onSaveToggle) {
                onSaveToggle(pub.id, false);
            }

            const { error } = await supabase
                .from('saves')
                .delete()
                .eq('pub_id', pub.id)
                .eq('user_id', user.id);

            setIsSaving(false);

            if (!error) {
                dispatch(setPubSave({ id: pub.id, value: false }));
            } else {
                if (onSaveToggle) {
                    onSaveToggle(pub.id, true);
                }

                console.error(error);
            }
        }
    }, [user, dispatch, isSaving, onSaveToggle, pub]);

    return (
        <Pressable
            style={[styles.container, { width: COMPONENT_WIDTH }]}
            onPress={() =>
                navigation.navigate('PubView', { pub, onSaveToggle })
            }>
            <Image
                source={imageUrl ? { uri: imageUrl } : NO_IMAGE}
                style={[
                    styles.image,
                    { height: COMPONENT_WIDTH / ASPECT_RATIO },
                ]}
            />
            <View style={styles.heartContainer}>
                <Pressable onPress={toggleLike}>
                    <TouchableOpacity>
                        {pub.saved ? (
                            <Ionicons name="heart" size={14} color="#dc2626" />
                        ) : (
                            <Ionicons
                                name="heart-outline"
                                size={14}
                                color="#dc2626"
                            />
                        )}
                    </TouchableOpacity>
                </Pressable>
            </View>
            <PubInfo pub={pub} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 7,
    },
    image: {
        width: '100%',
        borderRadius: 10,
    },
    heartContainer: {
        height: 28,
        width: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 5,
        right: 5,
        zIndex: 99,
    },
});
