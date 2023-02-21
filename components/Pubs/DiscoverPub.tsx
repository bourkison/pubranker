import { supabase } from '@/services/supabase';
import { PubType } from '@/types';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ImageScroller from '@/components/Utility/ImageScroller';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '@/store/hooks';
import { setPub } from '@/store/slices/pub';
import { distanceString } from '@/services';

type DiscoverPubProps = {
    pub: PubType;
};

export default function DiscoverPub({ pub }: DiscoverPubProps) {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!imageUrls.length) {
            let urls: string[] = [];

            pub.photos.forEach(photo => {
                const url = supabase.storage.from('pubs').getPublicUrl(photo);
                urls.push(url.data.publicUrl);
            });

            setImageUrls(urls);
        }
    }, [pub, imageUrls]);

    const selectPub = () => {
        dispatch(setPub(pub));

        console.log('SELECT:', pub);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={selectPub}>
                    <View style={styles.titleSubTitleContainer}>
                        <View>
                            <Text style={styles.title}>{pub.name}</Text>
                        </View>
                        <View>
                            <Text style={styles.subtitle}>
                                {distanceString(pub.dist_meters)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View>
                    <Ionicons name="heart-outline" size={18} color="#dc2626" />
                </View>
            </View>
            <View>
                <ImageScroller images={imageUrls} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
        marginBottom: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        justifyContent: 'space-between',
    },
    titleSubTitleContainer: {
        marginLeft: 10,
        flexDirection: 'column',
    },
    title: {
        fontSize: 16,
        fontWeight: '400',
    },
    subtitle: {
        fontSize: 12,
        color: '#A3A3A3',
    },
});
