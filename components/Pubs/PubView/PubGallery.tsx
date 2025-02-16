import ImageScroller from '@/components/Utility/ImageScroller';
import { Tables } from '@/types/schema';
import { supabase } from '@/services/supabase';
import React, { useMemo, useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

type PubGalleryProps = {
    photos: Tables<'pub_photos'>[];
};

export default function PubGallery({ photos }: PubGalleryProps) {
    const imageFlatListRef = useRef<FlatList>(null);

    const images = useMemo(
        () =>
            photos.map(
                photo =>
                    supabase.storage.from('pubs').getPublicUrl(photo.key).data
                        .publicUrl,
            ),
        [photos],
    );

    return (
        <View style={styles.container}>
            {images.length ? (
                <ImageScroller
                    imageFlatListRef={imageFlatListRef}
                    images={images}
                    percentageWidth={0.6}
                    aspectRatio={1.33}
                />
            ) : undefined}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        marginBottom: 40,
    },
});
