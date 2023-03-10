import { supabase } from '@/services/supabase';
import { DiscoveredPub } from '@/types';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ImageScroller from '@/components/Utility/ImageScroller';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '@/store/hooks';
import { setPub } from '@/store/slices/pub';
import { distanceString } from '@/services';

type DiscoverPubProps = {
    pub: DiscoveredPub;
};

export default function DiscoverPub({ pub }: DiscoverPubProps) {
    const [imageUrls, setImageUrls] = useState<string[] | null>(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (imageUrls === null) {
            let urls: string[] = [];

            pub.photos.forEach(photo => {
                console.log('PHOTO:', photo);
                const url = supabase.storage.from('pubs').getPublicUrl(photo);
                urls.push(url.data.publicUrl);
            });

            setImageUrls(urls);
        }
    }, [pub, imageUrls]);

    const selectPub = () => {
        dispatch(setPub({ pub, reference: 'discover' }));
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={selectPub}>
                    <View style={styles.titleSubTitleContainer}>
                        <View>
                            <Text style={styles.title}>{pub.name}</Text>
                        </View>
                        <View style={styles.subtitleContainer}>
                            <Ionicons
                                name="logo-google"
                                color="#A3A3A3"
                                style={styles.googleLogo}
                            />
                            <Text style={styles.subtitle}>
                                {pub.google_rating}
                                {' ('}
                                {pub.google_ratings_amount}
                                {') | '}
                            </Text>
                            <Text style={styles.subtitle}>
                                {distanceString(pub.dist_meters)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View>
                    {pub.saved ? (
                        <Ionicons name="heart" size={18} color="#dc2626" />
                    ) : (
                        <Ionicons
                            name="heart-outline"
                            size={18}
                            color="#dc2626"
                        />
                    )}
                </View>
            </View>
            <View>
                <ImageScroller images={imageUrls || []} />
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
    subtitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 12,
        color: '#A3A3A3',
    },
    googleLogo: {
        marginRight: 2,
    },
});
