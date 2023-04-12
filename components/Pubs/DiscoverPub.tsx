import { supabase } from '@/services/supabase';
import { DiscoveredPub, SavedPub } from '@/types';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ImageScroller from '@/components/Utility/ImageScroller';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { distanceString } from '@/services';

type DiscoverPubProps = {
    pub: DiscoveredPub | SavedPub;
    onSelect?: () => void;
};

export default function DiscoverPub({ pub, onSelect }: DiscoverPubProps) {
    const [imageUrls, setImageUrls] = useState<string[] | null>(null);

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

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => (onSelect ? onSelect() : undefined)}>
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
