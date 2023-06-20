import { averageReviews, distanceString, roundToNearest } from '@/services';
import { supabase } from '@/services/supabase';
import { DiscoveredPub } from '@/types';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

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

    const navigation =
        useNavigation<StackNavigationProp<MainNavigatorStackParamList>>();

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
        <Pressable
            style={[styles.container, { width: COMPONENT_WIDTH }]}
            onPress={() => navigation.navigate('PubView', { pub })}>
            <Image
                source={imageUrl ? { uri: imageUrl } : NO_IMAGE}
                style={[
                    styles.image,
                    { height: COMPONENT_WIDTH / ASPECT_RATIO },
                ]}
            />
            <View style={styles.infoContainer}>
                <View style={styles.reviewContainer}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>
                        {roundToNearest(
                            averageReviews(
                                pub.review_beer,
                                pub.review_food,
                                pub.review_location,
                                pub.review_music,
                                pub.review_service,
                                pub.review_vibe,
                            ),
                            0.1,
                        ).toFixed(1)}
                    </Text>
                    <Text style={styles.numReviewsText}>
                        ({pub.num_reviews})
                    </Text>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{pub.name}</Text>
                </View>
                <View style={styles.addressContainer}>
                    <Text style={styles.addressText}>{pub.address}</Text>
                </View>
                <View style={styles.distanceContainer}>
                    <Text style={styles.distanceText}>
                        {distanceString(pub.dist_meters)}
                    </Text>
                </View>
            </View>
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
    infoContainer: {
        marginTop: 10,
        paddingHorizontal: 2,
    },
    reviewContainer: {
        flexDirection: 'row',
        alignContent: 'center',
    },
    ratingText: {
        marginLeft: 3,
        color: '#292935',
        fontWeight: '500',
    },
    numReviewsText: {
        marginLeft: 3,
        color: '#292935',
        fontWeight: '200',
    },
    titleContainer: {
        marginTop: 4,
    },
    titleText: {
        fontSize: 16,
        color: '#292935',
        fontWeight: '600',
    },
    addressContainer: {
        marginTop: 4,
    },
    addressText: {
        fontSize: 10,
        color: '#292935',
        fontWeight: '300',
    },
    distanceContainer: {
        marginTop: 4,
    },
    distanceText: {
        fontSize: 10,
        color: '#292935',
        fontWeight: '300',
    },
});
