import { ListReviewType } from '@/services/queries/review';
import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    Image,
    ImageSourcePropType,
    useWindowDimensions,
} from 'react-native';
import RatingsStarViewer from '@/components/Ratings/RatingsStarsViewer';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/services/supabase';
import { fromNowString } from '@/services';

const NO_IMAGE = require('@/assets/noimage.png');

type UserReviewType = {
    review: ListReviewType;
};

const IMAGE_WIDTH_PERCENTAGE = 0.2;
const IMAGE_RATIO = 1;

export default function UserReview({ review }: UserReviewType) {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();

    const image = useMemo<ImageSourcePropType>(() => {
        if (review.pub.primary_photo) {
            return {
                uri: supabase.storage
                    .from('pubs')
                    .getPublicUrl(review.pub.primary_photo).data.publicUrl,
            };
        }

        return NO_IMAGE;
    }, [review]);

    const imageWidth = useMemo<number>(
        () => width * IMAGE_WIDTH_PERCENTAGE,
        [width],
    );
    const imageHeight = useMemo<number>(
        () => imageWidth / IMAGE_RATIO,
        [imageWidth],
    );

    return (
        <TouchableHighlight
            style={styles.container}
            underlayColor="#E5E7EB"
            onPress={() =>
                navigation.navigate('ViewReview', { reviewId: review.id })
            }>
            <>
                <View style={styles.topBarContainer}>
                    <View>
                        <Text style={styles.pubNameText}>
                            {review.pub.name}
                        </Text>
                        <View style={styles.starsContainer}>
                            <RatingsStarViewer
                                amount={review.rating}
                                size={14}
                                padding={0}
                            />
                        </View>
                    </View>

                    <View style={styles.createdAtContainer}>
                        <Text style={styles.createdAtText}>
                            {fromNowString(review.created_at)}
                        </Text>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={image}
                            style={[
                                styles.image,
                                { width: imageWidth, height: imageHeight },
                            ]}
                        />
                    </View>

                    <View style={styles.contentTextContainer}>
                        <Text style={styles.contentText}>{review.content}</Text>
                    </View>
                </View>
            </>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 25,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    topBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    createdAtContainer: {},
    createdAtText: {
        fontSize: 10,
        fontWeight: '300',
    },
    pubNameText: {
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: -0.3,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    contentContainer: {
        flexDirection: 'row',
        marginTop: 4,
    },

    imageContainer: {
        marginRight: 7,
        marginTop: 2,
    },
    image: {
        borderRadius: 2,
    },
    contentTextContainer: {
        flex: 1,
        // paddingTop: 5,
    },
    contentText: {
        fontWeight: '300',
        fontSize: 12,
        letterSpacing: -0.2,
    },
});
