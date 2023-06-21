import { supabase } from '@/services/supabase';
import { DiscoveredPub } from '@/types';
import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    useWindowDimensions,
    Image,
    FlatList,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import PubInfo from './PubInfo';

type BottomSheetPubItemProps = {
    pub: DiscoveredPub;
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

    const { width } = useWindowDimensions();

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
            <View>
                <PubInfo pub={pub} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        paddingBottom: 25,
        flex: 1,
    },
    carouselList: {
        flex: 1,
        borderRadius: 10,
    },
    image: {},
});
