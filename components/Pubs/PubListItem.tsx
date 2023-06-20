import { supabase } from '@/services/supabase';
import { DiscoveredPub } from '@/types';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import { Image, View } from 'react-native';

const NO_IMAGE = require('@/assets/noimage.png');
const WIDTH_PERCENTAGE = 0.8;
const ASPECT_RATIO = 1.3333; // 4:3

type PubListItemProps = {
    pub: DiscoveredPub;
};

export default function PubListItem({ pub }: PubListItemProps) {
    const [imageUrl, setImageUrl] = useState<string>('');

    const { width } = useWindowDimensions();
    const COMPONENT_WIDTH = width * WIDTH_PERCENTAGE;

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

    return (
        <View style={[styles.container, { width: COMPONENT_WIDTH }]}>
            <Image
                source={imageUrl ? { uri: imageUrl } : NO_IMAGE}
                style={[
                    styles.image,
                    { height: COMPONENT_WIDTH / ASPECT_RATIO },
                ]}
            />
            <Text>{pub.name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
    },
    image: {
        width: '100%',
        height: 64,
        borderRadius: 5,
    },
});
