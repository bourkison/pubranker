import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { PRIMARY_COLOR, SUCCESS_COLOR } from '@/constants';
import Sortable from 'react-native-sortables';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/services/supabase';
import { AntDesign } from '@expo/vector-icons';
import uuid from 'react-native-uuid';

const IMAGE_ASPECT_RATIO = 1.3333;
const IMAGE_MARGIN = 5;
const COLUMNS_AMOUNT = 3;
const MAX_IMAGES_AMOUNT = 6;

export type ImageType = { id: string; local: boolean; value: string };

type ReviewImageUploadProps = {
    images: ImageType[];
    setImages: Dispatch<SetStateAction<ImageType[]>>;
    setImagesToDelete: Dispatch<SetStateAction<string[]>>;
};

export default function ReviewImageUpload({
    images,
    setImages,
    setImagesToDelete,
}: ReviewImageUploadProps) {
    const [imageWidth, setImageWidth] = useState(0);

    const imageHeight = useMemo<number>(
        () => imageWidth / IMAGE_ASPECT_RATIO,
        [imageWidth],
    );

    const calculateImageWidth = useCallback((containerWidth: number) => {
        setImageWidth(containerWidth / 3 - 2 * IMAGE_MARGIN);
    }, []);

    const selectImage = useCallback(async () => {
        console.log('SETTING IMAGE', images.length);

        if (images.length >= MAX_IMAGES_AMOUNT) {
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        if (result.canceled) {
            return;
        }

        const assets = result.assets.filter(
            asset => typeof asset.base64 === 'string',
        );

        setImages([
            ...images,
            ...assets.map(asset => ({
                id: uuid.v4(),
                local: true,
                value: `${asset.base64}`,
            })),
        ]);
    }, [images, setImages]);

    const removeImage = useCallback(
        (index: number) => {
            if (!images[index]) {
                return;
            }

            const temp = images.slice();
            temp.splice(index, 1);

            if (images[index].local === false) {
                setImagesToDelete(i => [...i, images[index].value]);
            }

            setImages(temp);
        },
        [setImagesToDelete, setImages, images],
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={selectImage}>
                <Text style={styles.addImageText}>Add Image...</Text>
            </TouchableOpacity>

            <View
                style={styles.sortableContainer}
                onLayout={({
                    nativeEvent: {
                        layout: { width },
                    },
                }) => calculateImageWidth(width)}>
                <Sortable.Grid
                    data={images}
                    columns={COLUMNS_AMOUNT}
                    onDragEnd={({ data }) => setImages(data)}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }) => (
                        <View style={styles.imageContainer}>
                            <Pressable
                                style={styles.removeIconContainer}
                                onPress={() => removeImage(index)}>
                                <AntDesign
                                    name="close"
                                    size={12}
                                    color="#000"
                                />
                            </Pressable>

                            <Image
                                style={[
                                    styles.image,
                                    { width: imageWidth, height: imageHeight },
                                ]}
                                source={{
                                    uri: item.local
                                        ? `data:image/jpeg;base64,${item.value}`
                                        : supabase.storage
                                              .from('reviews')
                                              .getPublicUrl(item.value).data
                                              .publicUrl,
                                }}
                            />
                        </View>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    addImageText: {
        fontSize: 10,
        fontWeight: '500',
        color: PRIMARY_COLOR,
        marginLeft: 10,
    },
    sortableContainer: {},
    imageContainer: {
        marginTop: 5,
    },
    image: {
        borderRadius: 2,
    },
    addImage: {
        backgroundColor: '#E5E7EB',
    },
    addImageIconContainer: {
        backgroundColor: SUCCESS_COLOR,
        position: 'absolute',
        top: -5,
        right: -7,
        height: 20,
        width: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
    removeIconContainer: {
        position: 'absolute',
        top: -7,
        right: 0,
        backgroundColor: '#FFF',
        height: 20,
        width: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
});
