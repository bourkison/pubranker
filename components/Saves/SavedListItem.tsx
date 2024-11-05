import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { PubItemType } from '@/components/Pubs/PubItem';
import { Ionicons } from '@expo/vector-icons';
import { distanceString, roundToNearest } from '@/services';
import { GOLD_RATINGS_COLOR } from '@/constants';
import { supabase } from '@/services/supabase';

const NO_IMAGE = require('@/assets/noimage.png');

type BottomSheetPubItemProps = {
    pub: PubItemType;
    onSaveCommence?: (id: number) => void;
    onSaveComplete?: (success: boolean, id: number) => void;
    onUnsaveCommence?: (id: number) => void;
    onUnsaveComplete?: (success: boolean, id: number) => void;
};

const ASPECT_RATIO = 1;
const WIDTH_PERCENTAGE = 0.3;

export default function SavedListItem({ pub }: BottomSheetPubItemProps) {
    const [containerWidth, setContainerWidth] = useState(0);
    const [imageUrl, setImageUrl] = useState('');

    const IMAGE_WIDTH = useMemo(
        () => containerWidth * WIDTH_PERCENTAGE,
        [containerWidth],
    );

    useEffect(() => {
        const url = supabase.storage
            .from('pubs')
            .getPublicUrl(pub.primary_photo);

        setImageUrl(url.data.publicUrl);
    }, [pub]);

    return (
        <View style={styles.container}>
            <View
                style={styles.innerContainer}
                onLayout={({
                    nativeEvent: {
                        layout: { width },
                    },
                }) => setContainerWidth(width)}>
                <View>
                    <Image
                        source={imageUrl ? { uri: imageUrl } : NO_IMAGE}
                        style={[
                            styles.image,
                            {
                                width: IMAGE_WIDTH,
                                height: IMAGE_WIDTH / ASPECT_RATIO,
                            },
                        ]}
                    />
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.reviewContainer}>
                        <Ionicons
                            name="star"
                            size={12}
                            color={GOLD_RATINGS_COLOR}
                        />
                        <Text style={styles.ratingText}>
                            {roundToNearest(pub.rating, 0.1).toFixed(1)}
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
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        paddingVertical: 10,
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoContainer: {
        paddingHorizontal: 2,
        marginLeft: 5,
        flex: 1,
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
    image: {
        borderRadius: 3,
    },
});
