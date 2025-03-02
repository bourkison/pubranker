import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native';
import { Fontisto, Ionicons } from '@expo/vector-icons';
import { distanceString, roundToNearest } from '@/services';
import { GOLD_RATINGS_COLOR } from '@/constants';
import { supabase } from '@/services/supabase';
import { useNavigation } from '@react-navigation/native';
import { WishlistType } from '@/screens/SavedNavigator/WishlistsHome';

const NO_IMAGE = require('@/assets/noimage.png');

type WishlistedListItemProps = {
    pub: WishlistType['pub'];
    wishlisted: boolean;
    onWishlistCommence?: (id: number) => void;
    onWishlistComplete?: (success: boolean, id: number) => void;
    onUnwishlistCommence?: (id: number) => void;
    onUnwishlistComplete?: (success: boolean, id: number) => void;
};

const ASPECT_RATIO = 1;
const WIDTH_PERCENTAGE = 0.3;

export default function WishlistedListItem({
    pub,
    wishlisted,
    onWishlistCommence,
    onWishlistComplete,
    onUnwishlistCommence,
    onUnwishlistComplete,
}: WishlistedListItemProps) {
    const [imageUrl, setImageUrl] = useState('');
    const [isWishlisting, setIsWishlisting] = useState(false);

    const navigation = useNavigation();

    const { width } = useWindowDimensions();

    const IMAGE_WIDTH = useMemo(() => width * WIDTH_PERCENTAGE, [width]);

    useEffect(() => {
        const url = supabase.storage
            .from('pubs')
            .getPublicUrl(pub.primary_photo || '');

        setImageUrl(url.data.publicUrl);
    }, [pub]);

    const toggleWishlist = useCallback(async () => {
        if (isWishlisting) {
            return;
        }

        setIsWishlisting(true);

        const { data: userData, error: userError } =
            await supabase.auth.getUser();

        if (userError) {
            console.error(userError);
            setIsWishlisting(false);
            return;
        }

        if (!wishlisted) {
            onWishlistCommence && onWishlistCommence(pub.id);

            const { error } = await supabase.from('wishlists').insert({
                pub_id: pub.id,
                user_id: userData.user.id,
            });

            setIsWishlisting(false);

            if (error) {
                console.error(error);
                onWishlistComplete && onWishlistComplete(false, pub.id);
                return;
            }

            onWishlistComplete && onWishlistComplete(true, pub.id);
        } else {
            onUnwishlistCommence && onUnwishlistCommence(pub.id);

            const { error } = await supabase
                .from('wishlists')
                .delete()
                .eq('pub_id', pub.id)
                .eq('user_id', userData.user.id);

            setIsWishlisting(false);

            if (error) {
                console.error(error);
                onUnwishlistComplete && onUnwishlistComplete(false, pub.id);
                return;
            }

            onUnwishlistComplete && onUnwishlistComplete(true, pub.id);
        }
    }, [
        isWishlisting,
        onWishlistCommence,
        onWishlistComplete,
        onUnwishlistCommence,
        onUnwishlistComplete,
        pub,
        wishlisted,
    ]);

    return (
        <TouchableHighlight
            style={styles.container}
            underlayColor="#E5E7EB"
            onPress={() =>
                navigation.navigate('PubHome', {
                    screen: 'PubView',
                    params: { pubId: pub.id },
                })
            }>
            <View style={styles.innerContainer}>
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
                        onPress={toggleWishlist}
                        disabled={isWishlisting}
                        style={styles.saveButton}>
                        {wishlisted ? (
                            <Fontisto
                                name="bookmark-alt"
                                size={12}
                                color="#000"
                            />
                        ) : (
                            <Fontisto name="bookmark" size={12} color="#000" />
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
