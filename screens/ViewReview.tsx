import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import UserAvatar from '@/components/User/UserAvatar';
import { supabase } from '@/services/supabase';
import { UserReviewType } from '@/types';
import { convertViewToUserReviews } from '@/services';
import RatingsStarViewer from '@/components/Ratings/RatingsStarsViewer';

const NO_IMAGE = require('@/assets/noimage.png');

const ASPECT_RATIO = 1.3333;
const WIDTH_PERCENTAGE = 0.3;
const IMAGE_MARGIN = 10;

export default function ViewReview({
    route,
    navigation,
}: StackScreenProps<MainNavigatorStackParamList, 'ViewReview'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [review, setReview] = useState<UserReviewType>();

    const [imageUrl, setImageUrl] = useState('');

    const [contentWidth, setContentWidth] = useState(1);

    const IMAGE_WIDTH = useMemo(
        () => contentWidth * WIDTH_PERCENTAGE,
        [contentWidth],
    );

    useEffect(() => console.log(IMAGE_WIDTH), [IMAGE_WIDTH]);

    useEffect(() => {
        const fetchReview = async () => {
            setIsLoading(true);

            const { data, error } = await supabase
                .from('user_reviews')
                .select()
                .eq('id', route.params.reviewId)
                .limit(1)
                .single();

            setIsLoading(false);

            if (error) {
                console.error(error);
                return;
            }

            if (data.pub_primary_photo) {
                const url = supabase.storage
                    .from('pubs')
                    .getPublicUrl(data.pub_primary_photo);

                setImageUrl(url.data.publicUrl);
            }

            setReview(convertViewToUserReviews(data));
        };

        fetchReview();
    }, [route]);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (!review) {
        return (
            <View>
                <Text>No review loaded</Text>
            </View>
        );
    }

    return (
        <SafeAreaView>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.settingsContainer}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={14} />
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Review</Text>
                </View>

                <TouchableOpacity style={styles.menuContainer}>
                    <SimpleLineIcons name="options" size={14} />
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                <View
                    onLayout={({
                        nativeEvent: {
                            layout: { width: w },
                        },
                    }) => setContentWidth(w)}>
                    <View
                        style={[
                            styles.pubInfoContainer,
                            {
                                width:
                                    contentWidth -
                                    contentWidth * WIDTH_PERCENTAGE,
                            },
                        ]}>
                        <View style={styles.pubInfoLeftColumn}>
                            <View style={styles.userContainer}>
                                <UserAvatar
                                    photo={review.user_profile_photo}
                                    size={18}
                                />

                                <Text style={styles.usernameText}>
                                    {review.user_name}
                                </Text>
                            </View>

                            <View style={styles.pubNameContainer}>
                                <Text style={styles.pubNameText}>
                                    {review.pub_name}
                                </Text>

                                <Text style={styles.pubAddressText}>
                                    {review.pub_address}
                                </Text>
                            </View>

                            <View style={styles.ratingsContainer}>
                                <RatingsStarViewer
                                    padding={0}
                                    amount={review.rating}
                                    size={18}
                                />
                            </View>
                        </View>

                        <View
                            style={[
                                styles.pubInfoRightColumn,
                                { width: IMAGE_WIDTH },
                            ]}>
                            <Image
                                source={imageUrl ? { uri: imageUrl } : NO_IMAGE}
                                style={[
                                    styles.pubImage,
                                    {
                                        width: IMAGE_WIDTH - IMAGE_MARGIN,
                                        height:
                                            (IMAGE_WIDTH - IMAGE_MARGIN) /
                                            ASPECT_RATIO,
                                    },
                                ]}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const ICON_PADDING = 10;

const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    settingsContainer: {
        paddingLeft: ICON_PADDING,
    },
    menuContainer: {
        paddingRight: ICON_PADDING,
    },
    avatarTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Jost',
        textAlign: 'center',
    },
    contentContainer: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: '100%',
    },
    pubInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pubInfoLeftColumn: {},
    userContainer: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    usernameText: {
        marginLeft: 5,
        fontWeight: '500',
        fontSize: 14,
    },
    pubNameContainer: {
        marginTop: 15,
    },
    pubNameText: {
        fontWeight: '500',
        fontSize: 18,
    },
    pubAddressText: {
        fontWeight: '300',
        fontSize: 10,
        marginTop: 3,
    },
    ratingsContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    pubInfoRightColumn: {
        backgroundColor: 'red',
        flex: 1,
        marginLeft: IMAGE_MARGIN,
        borderRadius: 3,
    },
    pubImage: {
        borderRadius: 3,
    },
});
