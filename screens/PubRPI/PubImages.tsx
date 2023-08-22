import ImageScroller from '@/components/Utility/ImageScroller';
import { usePubRPIContext } from '@/nav/context/context';
import { supabase } from '@/services/supabase';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

export default function PubImages() {
    const { pub } = usePubRPIContext();

    const imageFlatListRef = useRef<FlatList>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        let urls: string[] = [];
        setImageUrls([]);

        pub.photos.forEach(photo => {
            const url = supabase.storage.from('pubs').getPublicUrl(photo);
            urls.push(url.data.publicUrl);
        });

        setImageUrls(urls);
    }, [pub]);

    return (
        <View style={styles.container}>
            <ImageScroller
                imageFlatListRef={imageFlatListRef}
                images={imageUrls || []}
                height={220}
                width={220}
                margin={5}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
    },
});
