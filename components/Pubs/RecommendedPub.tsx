import { supabase } from '@/services/supabase';
import { PubSchema } from '@/types';
import React, { useEffect, useState } from 'react';
import {
    Pressable,
    Image,
    StyleSheet,
    useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import PubInfo from '@/components/Pubs/PubView/PubInfo';

const NO_IMAGE = require('@/assets/noimage.png');
const WIDTH_PERCENTAGE = 0.8;
const ASPECT_RATIO = 1.3333; // 4:3

type RecommendedPubItemProps = {
    pub: PubSchema;
    onSaveToggle?: (id: number, value: boolean) => void;
};

export default function RecommendedPubItem({
    pub,
    onSaveToggle,
}: RecommendedPubItemProps) {
    const [imageUrl, setImageUrl] = useState('');

    const { width } = useWindowDimensions();
    const COMPONENT_WIDTH = width * WIDTH_PERCENTAGE;

    const navigation =
        useNavigation<StackNavigationProp<MainNavigatorStackParamList>>();

    useEffect(() => {
        if (pub.photos[0]) {
            const url = supabase.storage
                .from('pubs')
                .getPublicUrl(pub.photos[0]);

            setImageUrl(url.data.publicUrl);
        }
    }, [pub]);

    return (
        <Pressable
            style={[styles.container, { width: COMPONENT_WIDTH }]}
            onPress={() =>
                navigation.navigate('PubView', { pubId: pub.id, onSaveToggle })
            }>
            <Image
                source={imageUrl ? { uri: imageUrl } : NO_IMAGE}
                style={[
                    styles.image,
                    { height: COMPONENT_WIDTH / ASPECT_RATIO },
                ]}
            />
            <PubInfo pub={pub} />
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
