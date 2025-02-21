import { UserType } from '@/services/queries/user';
import { supabase } from '@/services/supabase';
import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    TouchableOpacity,
} from 'react-native';
import RatingsStarViewer from '@/components/Ratings/RatingsStarsViewer';
import { StackActions, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

type ProfileRecentRatingsProps = {
    recentRatings: UserType['recent_ratings'];
    userId: string;
};

const NO_IMAGE = require('@/assets/noimage.png');
const MAX_RECENT = 3;
const IMAGE_PADDING = 2;

export default function ProfileRecentRatings({
    recentRatings,
    userId,
}: ProfileRecentRatingsProps) {
    const navigation = useNavigation();

    const [elementWidth, setElementWidth] = useState(0);

    const pubElementWidth = useMemo<number>(
        () => elementWidth / MAX_RECENT,
        [elementWidth],
    );

    const pubImageWidth = useMemo<number>(
        () => pubElementWidth - 2 * IMAGE_PADDING,
        [pubElementWidth],
    );

    const pubImageHeight = useMemo<number>(
        () => pubImageWidth / 1,
        [pubImageWidth],
    );

    const images = useMemo<string[]>(
        () =>
            recentRatings.map(rating => {
                if (rating.pubs.primary_photo) {
                    return supabase.storage
                        .from('pubs')
                        .getPublicUrl(rating.pubs.primary_photo).data.publicUrl;
                }

                return '';
            }),
        [recentRatings],
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Recent Activity</Text>

            <View
                style={styles.pubsContainer}
                onLayout={({
                    nativeEvent: {
                        layout: { width },
                    },
                }) => setElementWidth(width)}>
                {recentRatings.length === 0 && (
                    <View>
                        <Text style={styles.noActivityText}>
                            This user has no recent activity.
                        </Text>
                    </View>
                )}
                {recentRatings.map((rating, index) => (
                    <Pressable
                        onPress={() => {
                            const pushAction = StackActions.push('PubHome', {
                                screen: 'PubView',
                                params: {
                                    pubId: rating.pubs.id,
                                },
                            });
                            navigation.dispatch(pushAction);
                        }}
                        style={[
                            styles.pubContainer,
                            { width: pubElementWidth },
                        ]}
                        key={rating.id}>
                        <Image
                            source={
                                images[index]
                                    ? { uri: images[index] }
                                    : NO_IMAGE
                            }
                            style={[
                                styles.pubImage,
                                {
                                    width: pubImageWidth,
                                    height: pubImageHeight,
                                },
                            ]}
                        />

                        <View style={styles.starsContainer}>
                            <RatingsStarViewer
                                padding={0}
                                amount={rating.rating}
                                size={12}
                                color={'rgba(0, 0, 0, 0.4)'}
                            />
                        </View>
                    </Pressable>
                ))}
            </View>

            <TouchableOpacity
                style={styles.viewAllContainer}
                onPress={() =>
                    navigation.navigate('UserActivity', { userId: userId })
                }>
                <Text style={styles.viewAllText}>View all activity</Text>

                <Feather
                    name="chevron-right"
                    size={16}
                    color={'rgba(0, 0, 0, 0.6)'}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        borderColor: '#E5E7EB',
        borderBottomWidth: 1,
        paddingVertical: 15,
    },
    headerText: {
        fontSize: 16,
        fontFamily: 'Jost',
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    pubsContainer: {
        width: '100%',
        flexDirection: 'row',
    },
    pubContainer: {},
    pubImage: {
        borderRadius: 2,
    },
    starsContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    noActivityText: {
        fontStyle: 'italic',
        fontWeight: '300',
        fontSize: 12,
    },
    viewAllContainer: {
        marginTop: 15,
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginHorizontal: 10,
        paddingTop: 15,
        borderColor: '#E5E7EB',
        borderTopWidth: 1,
    },
    viewAllText: {
        fontSize: 12,
        fontWeight: '300',
    },
});
