import { supabase } from '@/services/supabase';
import { PubType } from '@/types';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import ImageScroller from '@/components/Utility/ImageScroller';

type DiscoverPubProps = {
    pub: PubType;
};

export default function DiscoverPub({ pub }: DiscoverPubProps) {
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        if (!imageUrls.length) {
            let urls: string[] = [];

            pub.photos.forEach(photo => {
                const url = supabase.storage.from('pubs').getPublicUrl(photo);
                urls.push(url.data.publicUrl);
            });

            setImageUrls(urls);
        }

        console.log('PHOTOS:', pub.photos, imageUrls);
    }, [pub, imageUrls]);

    return (
        <View>
            <Text>{pub.name}</Text>
            <View>
                <ImageScroller images={imageUrls} />
            </View>
        </View>
    );
}
