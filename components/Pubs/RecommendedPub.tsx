import { supabase } from '@/services/supabase';
import React, { useEffect, useState } from 'react';
import {
    Pressable,
    Image,
    StyleSheet,
    useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PubInfo from '@/components/Pubs/PubView/PubInfo';
import { Database } from '@/types/schema';

const NO_IMAGE = require('@/assets/noimage.png');
const WIDTH_PERCENTAGE = 0.8;
const ASPECT_RATIO = 1.3333; // 4:3

type RecommendedPubItemProps = {
    pub: Database['public']['Functions']['get_pub_list_item']['Returns'][number];
    onSaveToggle?: (id: number, value: boolean) => void;
};

export default function RecommendedPubItem({
    pub,
    onSaveToggle,
}: RecommendedPubItemProps) {
    const [imageUrl, setImageUrl] = useState('');

    const { width } = useWindowDimensions();
    const COMPONENT_WIDTH = width * WIDTH_PERCENTAGE;

    const navigation = useNavigation();

    useEffect(() => {
        if (pub.photos[0]) {
            const url = supabase.storage
                .from('pubs')
                .getPublicUrl(pub.photos[0] || '');

            setImageUrl(url.data.publicUrl);
        }
    }, [pub]);

    return (
        <Pressable
            style={[styles.container, { width: COMPONENT_WIDTH }]}
            onPress={() =>
                navigation.navigate('PubHome', {
                    screen: 'PubView',
                    params: { pubId: pub.id, onSaveToggle },
                })
            }>
            <Image
                source={imageUrl ? { uri: imageUrl } : NO_IMAGE}
                style={[
                    styles.image,
                    { height: COMPONENT_WIDTH / ASPECT_RATIO },
                ]}
            />
            <PubInfo
                name={pub.name}
                address={pub.address}
                distMeters={pub.dist_meters}
                numReviews={pub.num_reviews}
                rating={pub.rating}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 7,
    },
    image: {
        width: '100%',
        borderRadius: 10,
    },
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
