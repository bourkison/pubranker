import ImageScroller from '@/components/Utility/ImageScroller';
import { supabase } from '@/services/supabase';
import React, { useMemo, useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

type GalleryProps = {
    photos: string[];
    type: 'pubs' | 'reviews';
    percentageWidth?: number;
};

export default function Gallery({
    photos,
    type,
    percentageWidth = 0.6,
}: GalleryProps) {
    const imageFlatListRef = useRef<FlatList>(null);

    const images = useMemo(
        () =>
            photos.map(
                photo =>
                    supabase.storage.from(type).getPublicUrl(photo).data
                        .publicUrl,
            ),
        [photos, type],
    );

    return (
        <View style={styles.container}>
            {images.length ? (
                <ImageScroller
                    imageFlatListRef={imageFlatListRef}
                    images={images}
                    percentageWidth={percentageWidth}
                    aspectRatio={1.33}
                />
            ) : undefined}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
});
