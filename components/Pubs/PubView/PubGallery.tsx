import ImageScroller from '@/components/Utility/ImageScroller';
import { FetchPubType } from '@/services/queries/pub';
// import { supabase } from '@/services/supabase';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

type PubGalleryProps = {
    pub: FetchPubType;
};

export default function PubGallery({ pub }: PubGalleryProps) {
    const imageFlatListRef = useRef<FlatList>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        let urls: string[] = [];
        setImageUrls([]);

        // TODO: Fix.
        // pub.photos.forEach(photo => {
        //     const url = supabase.storage
        //         .from('pubs')
        //         .getPublicUrl(photo?.key || '');
        //     urls.push(url.data.publicUrl);
        // });

        setImageUrls(urls);
    }, [pub]);

    return (
        <View style={styles.container}>
            {imageUrls.length ? (
                <ImageScroller
                    imageFlatListRef={imageFlatListRef}
                    images={imageUrls || []}
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
