import { supabase } from '@/services/supabase';
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
import { Ionicons } from '@expo/vector-icons';
import { useSharedCollectionContext } from '@/context/collectionContext';
import { ExplorePub } from '@/store/slices/explore';

type BottomSheetPubItemProps = {
    pub: ExplorePub;
    onSaveCommence?: (id: number) => void;
    onSaveComplete?: (success: boolean, id: number) => void;
    onUnsaveCommence?: (id: number) => void;
    onUnsaveComplete?: (success: boolean, id: number) => void;
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

export default function PubItem({
    pub,
    onSaveCommence,
    onSaveComplete,
    onUnsaveCommence,
    onUnsaveComplete,
}: BottomSheetPubItemProps) {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const { width } = useWindowDimensions();
    const navigation = useNavigation();

    const { showAddToCollection } = useSharedCollectionContext();

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
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        const { data: userData, error: userError } =
            await supabase.auth.getUser();

        if (userError) {
            console.error(userError);
            setIsSaving(false);
            return;
        }

        if (!pub.saved) {
            onSaveCommence && onSaveCommence(pub.id);

            const { error } = await supabase.from('saves').insert({
                pub_id: pub.id,
            });

            setIsSaving(false);

            if (error) {
                console.error(error);
                onSaveComplete && onSaveComplete(false, pub.id);
            }

            showAddToCollection(pub.id);
            onSaveComplete && onSaveComplete(true, pub.id);
        } else {
            onUnsaveCommence && onUnsaveCommence(pub.id);

            const { error } = await supabase
                .from('saves')
                .delete()
                .eq('pub_id', pub.id)
                .eq('user_id', userData.user.id);

            setIsSaving(false);

            if (error) {
                console.error(error);
                onUnsaveComplete && onUnsaveComplete(false, pub.id);
            }

            onUnsaveComplete && onUnsaveComplete(true, pub.id);
        }
    }, [
        isSaving,
        pub,
        onSaveCommence,
        onSaveComplete,
        onUnsaveCommence,
        onUnsaveComplete,
        showAddToCollection,
    ]);

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
            <Pressable
                onPress={() =>
                    navigation.navigate('PubView', { pubId: pub.id })
                }>
                <PubInfo
                    name={pub.name}
                    address={pub.address}
                    numReviews={pub.num_reviews}
                    distMeters={pub.dist_meters}
                    rating={pub.rating}
                />
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
