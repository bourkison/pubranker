import { FeedType } from '@/services/queries/feed';
import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Image,
    TouchableHighlight,
} from 'react-native';
import UserAvatar from '../User/UserAvatar';
import RatingsStarViewer from '../Ratings/RatingsStarsViewer';
import { supabase } from '@/services/supabase';
import { useNavigation } from '@react-navigation/native';

type FeedReviewItemProps = {
    user: FeedType['user'];
    review: NonNullable<FeedType['review']>;
};

const ASPECT_RATIO = 1;
const IMAGE_PERCENTAGE = 0.33;

const NO_IMAGE = require('@/assets/noimage.png');

export default function FeedReviewItem({ user, review }: FeedReviewItemProps) {
    const [elementWidth, setElementWidth] = useState(0);
    const navigation = useNavigation();

    const image = useMemo<string>(() => {
        if (review.pub.primary_photo) {
            return supabase.storage
                .from('pubs')
                .getPublicUrl(review.pub.primary_photo).data.publicUrl;
        }

        return '';
    }, [review]);

    const imageWidth = useMemo<number>(
        () => elementWidth * IMAGE_PERCENTAGE,
        [elementWidth],
    );

    const imageHeight = useMemo<number>(
        () => imageWidth / ASPECT_RATIO,
        [imageWidth],
    );

    if (review.content) {
        return (
            <TouchableHighlight
                underlayColor="#E5E7EB"
                style={styles.container}
                onPress={() =>
                    navigation.navigate('ViewReview', { reviewId: review.id })
                }>
                <>
                    <Pressable
                        style={styles.topContainer}
                        onPress={() =>
                            navigation.navigate('Profile', { userId: user.id })
                        }>
                        <View style={styles.avatarContainer}>
                            <UserAvatar size={24} photo={user.profile_photo} />
                        </View>

                        <View>
                            <Text style={styles.feedText}>
                                <Text style={styles.boldText}>
                                    {user.username}
                                </Text>{' '}
                                reviewed
                            </Text>
                        </View>
                    </Pressable>

                    <View style={styles.contentContainer}>
                        <Text style={styles.pubName}>{review.pub.name}</Text>
                        <View style={styles.starsContainer}>
                            <RatingsStarViewer
                                size={16}
                                amount={review.rating}
                                padding={0}
                            />
                        </View>

                        <View
                            style={styles.reviewContainer}
                            onLayout={({
                                nativeEvent: {
                                    layout: { width },
                                },
                            }) => setElementWidth(width)}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={image ? { uri: image } : NO_IMAGE}
                                    style={[
                                        styles.image,
                                        {
                                            width: imageWidth,
                                            height: imageHeight,
                                        },
                                    ]}
                                />
                            </View>

                            <View style={styles.reviewContentContainer}>
                                <Text style={styles.contentText}>
                                    {review.content}
                                </Text>
                            </View>
                        </View>
                    </View>
                </>
            </TouchableHighlight>
        );
    }

    return (
        <TouchableHighlight
            underlayColor="#E5E7EB"
            style={styles.noContentContainer}
            onPress={() =>
                navigation.navigate('PubHome', {
                    screen: 'PubView',
                    params: { pubId: review.pub.id },
                })
            }>
            <>
                <Pressable
                    style={styles.avatarPressable}
                    onPress={() =>
                        navigation.navigate('Profile', {
                            userId: user.id,
                        })
                    }>
                    <UserAvatar size={24} photo={user.profile_photo} />
                </Pressable>

                <View style={styles.textContentContainer}>
                    <Text style={styles.text}>
                        <Text style={styles.boldText}>{user.username}</Text>{' '}
                        rated{' '}
                        <Text style={styles.boldText}>{review.pub.name}</Text>{' '}
                    </Text>
                    <View style={styles.noContentStarsContainer}>
                        <RatingsStarViewer
                            amount={review.rating}
                            size={12}
                            padding={0}
                            color="rgba(0, 0, 0, 0.7)"
                        />
                    </View>
                </View>
            </>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    feedText: {
        fontSize: 12,
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        flexDirection: 'row',
        marginRight: 10,
    },
    contentContainer: {
        marginLeft: 38,
    },
    boldText: {
        fontWeight: '500',
    },
    pubName: {
        fontWeight: '600',
        letterSpacing: -0.4,
        fontSize: 16,
    },
    starsContainer: {
        flexDirection: 'row',
        marginTop: 2,
    },
    reviewContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    imageContainer: {},
    image: {
        borderRadius: 2,
    },
    reviewContentContainer: {
        marginLeft: 10,
    },
    contentText: {
        fontSize: 12,
    },
    avatarPressable: {
        flexDirection: 'row',
        marginRight: 10,
    },
    textContentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
    },
    text: {
        fontSize: 12,
    },
    noContentContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    noContentStarsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
