import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { distanceString, roundToNearest } from '@/services';
import { GOLD_RATINGS_COLOR } from '@/constants';
import { supabase } from '@/services/supabase';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { useSharedCollectionContext } from '@/context/collectionContext';
import { CollectionType } from '@/services/queries/collections';

const NO_IMAGE = require('@/assets/noimage.png');

type BottomSheetPubItemProps = {
    pub: CollectionType['collection_items'][number]['pub'];
    onSaveCommence?: (id: number) => void;
    onSaveComplete?: (success: boolean, id: number) => void;
    onUnsaveCommence?: (id: number) => void;
    onUnsaveComplete?: (success: boolean, id: number) => void;
};

const ASPECT_RATIO = 1;
const WIDTH_PERCENTAGE = 0.3;

export default function SavedListItem({
    pub,
    onSaveCommence,
    onSaveComplete,
    onUnsaveCommence,
    onUnsaveComplete,
}: BottomSheetPubItemProps) {
    const [containerWidth, setContainerWidth] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const { showAddToCollection } = useSharedCollectionContext();

    const navigation =
        useNavigation<StackNavigationProp<MainNavigatorStackParamList>>();

    const IMAGE_WIDTH = useMemo(
        () => containerWidth * WIDTH_PERCENTAGE,
        [containerWidth],
    );

    const saved = useMemo<boolean>(() => pub.saved[0].count > 0, [pub]);

    useEffect(() => {
        const url = supabase.storage
            .from('pubs')
            .getPublicUrl(pub.primary_photo || '');

        setImageUrl(url.data.publicUrl);
    }, [pub]);

    const toggleLike = useCallback(async () => {
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        const { data: userData, error: userError } =
            await supabase.auth.getUser();

        if (userError) {
            console.error(userError);
            setIsSaving(false);
            return;
        }

        if (!saved) {
            onSaveCommence && onSaveCommence(pub.id);

            const { error } = await supabase.from('saves').insert({
                pub_id: pub.id,
            });

            setIsSaving(false);

            if (error) {
                console.error(error);
                onSaveComplete && onSaveComplete(false, pub.id);
            }

            showAddToCollection(pub.id);
            onSaveComplete && onSaveComplete(true, pub.id);
        } else {
            onUnsaveCommence && onUnsaveCommence(pub.id);

            const { error } = await supabase
                .from('saves')
                .delete()
                .eq('pub_id', pub.id)
                .eq('user_id', userData.user.id);

            setIsSaving(false);

            if (error) {
                console.error(error);
                onUnsaveComplete && onUnsaveComplete(false, pub.id);
            }

            onUnsaveComplete && onUnsaveComplete(true, pub.id);
        }
    }, [
        isSaving,
        pub,
        onSaveCommence,
        onSaveComplete,
        onUnsaveCommence,
        onUnsaveComplete,
        showAddToCollection,
        saved,
    ]);

    return (
        <TouchableHighlight
            style={styles.container}
            underlayColor="#E5E7EB"
            onPress={() => navigation.navigate('PubView', { pubId: pub.id })}>
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

                    <TouchableOpacity
                        onPress={toggleLike}
                        disabled={isSaving}
                        style={styles.saveButton}>
                        {saved ? (
                            <Ionicons name="heart" size={12} color="#dc2626" />
                        ) : (
                            <Ionicons
                                name="heart-outline"
                                size={12}
                                color="#dc2626"
                            />
                        )}
                    </TouchableOpacity>
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
                            ({pub.num_reviews[0].count})
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
        </TouchableHighlight>
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
    saveButton: {
        height: 20,
        width: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 3,
        left: 3,
    },
});
