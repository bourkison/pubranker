import { supabase } from '@/services/supabase';
import { PubSchema } from '@/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    useWindowDimensions,
    Image,
    FlatList,
    StyleSheet,
    ViewStyle,
    Pressable,
    TouchableOpacity,
} from 'react-native';
import PubInfo from './PubView/PubInfo';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPubSave } from '@/store/slices/explore';

type BottomSheetPubItemProps = {
    pub: PubSchema;
};

const HORIZONTAL_PADDING = 30;
const IMAGE_RATIO = 1.33333;

type ImageItemProps = {
    imageWidth: number;
    index: number;
    imagesLength: number;
    item: string;
};

function ImageItem({ imageWidth, index, imagesLength, item }: ImageItemProps) {
    const borderRadiusStyle = useMemo<ViewStyle>(() => {
        return {
            borderTopLeftRadius:
                index === 0 ? styles.carouselList.borderRadius : 0,
            borderBottomLeftRadius:
                index === 0 ? styles.carouselList.borderRadius : 0,
            borderTopRightRadius:
                index === imagesLength - 1
                    ? styles.carouselList.borderRadius
                    : 0,
            borderBottomRightRadius:
                index === imagesLength - 1
                    ? styles.carouselList.borderRadius
                    : 0,
        };
    }, [index, imagesLength]);

    return (
        <Image
            source={{ uri: item }}
            style={[
                styles.image,
                {
                    width: imageWidth,
                    height: imageWidth / IMAGE_RATIO,
                },
                borderRadiusStyle,
            ]}
        />
    );
}

export default function BottomSheetPubItem({ pub }: BottomSheetPubItemProps) {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const user = useAppSelector(state => state.user.docData);

    const dispatch = useAppDispatch();

    const { width } = useWindowDimensions();
    const navigation =
        useNavigation<StackNavigationProp<MainNavigatorStackParamList>>();

    const IMAGE_WIDTH = width - HORIZONTAL_PADDING * 2;

    useEffect(() => {
        if (!imageUrls.length && pub.photos.length) {
            let urls: string[] = [];

            pub.photos.forEach(photo => {
                const url = supabase.storage.from('pubs').getPublicUrl(photo);
                urls.push(url.data.publicUrl);
            });

            setImageUrls(urls);
            console.log('urls', urls);
        }
    }, [pub, imageUrls]);

    const toggleLike = useCallback(async () => {
        if (!user || isSaving) {
            return;
        }

        console.log('TOGGLING LIKE');

        setIsSaving(true);

        if (!pub.saved) {
            dispatch(setPubSave({ id: pub.id, value: true }));

            const { error } = await supabase.from('saves').insert({
                pub_id: pub.id,
            });

            setIsSaving(false);

            if (error) {
                console.error(error);
                dispatch(setPubSave({ id: pub.id, value: false }));
            }
        } else {
            dispatch(setPubSave({ id: pub.id, value: false }));

            const { error } = await supabase
                .from('saves')
                .delete()
                .eq('pub_id', pub.id)
                .eq('user_id', user.id);

            setIsSaving(false);

            if (error) {
                console.error(error);
                dispatch(setPubSave({ id: pub.id, value: true }));
            }
        }
    }, [user, dispatch, isSaving, pub]);

    return (
        <View style={[styles.container, { width: IMAGE_WIDTH }]}>
            <View>
                {imageUrls.length ? (
                    <FlatList
                        data={imageUrls}
                        horizontal={true}
                        pagingEnabled={true}
                        style={styles.carouselList}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <ImageItem
                                item={item}
                                index={index}
                                imageWidth={IMAGE_WIDTH}
                                imagesLength={imageUrls.length}
                            />
                        )}
                    />
                ) : undefined}
            </View>
            <View style={styles.heartContainer}>
                <TouchableOpacity onPress={toggleLike}>
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
            </View>
            <Pressable onPress={() => navigation.navigate('PubView', { pub })}>
                <PubInfo pub={pub} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        paddingBottom: 25,
        flex: 1,
        zIndex: 1,
    },
    carouselList: {
        flex: 1,
        borderRadius: 10,
        zIndex: 2,
    },
    image: {},
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
