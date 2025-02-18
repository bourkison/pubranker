import RatingsStarViewer from '@/components/Ratings/RatingsStarsViewer';
import Header from '@/components/Utility/Header';
import { supabase } from '@/services/supabase';
import { RootStackScreenProps } from '@/types/nav';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HEADER_ICON_SIZE } from '@/constants';

type ReviewType = {
    id: number;
    rating: number;
    pub: {
        id: number;
        name: string;
        primary_photo: string | null;
    };
};

const NO_IMAGE = require('@/assets/noimage.png');
const NUM_COLUMNS = 4;
const IMAGE_PADDING = 4;

export default function UserRatings({
    route,
    navigation,
}: RootStackScreenProps<'UserRatings'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [elementWidth, setElementWidth] = useState(0);

    const pubElementWidth = useMemo<number>(
        () => elementWidth / NUM_COLUMNS,
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

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const { data, error } = await supabase
                .from('users_public')
                .select(
                    'id, reviews(id, rating, pub:pubs(id, name, primary_photo))',
                )
                .eq('id', route.params.userId)
                .order('updated_at', {
                    ascending: false,
                    referencedTable: 'reviews',
                })
                .limit(1)
                .single();

            if (error) {
                console.error(error);
                setIsLoading(false);
                return;
            }

            setReviews(data.reviews);
            setIsLoading(false);
        })();
    }, [route]);

    const pubImage = useCallback((image: string | null) => {
        if (image) {
            return {
                uri: supabase.storage.from('pubs').getPublicUrl(image).data
                    .publicUrl,
            };
        }

        return NO_IMAGE;
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Header
                header="User Ratings"
                leftColumn={
                    <TouchableOpacity
                        style={styles.backContainer}
                        onPress={() => navigation.goBack()}>
                        <Ionicons
                            name="arrow-back-outline"
                            size={HEADER_ICON_SIZE}
                        />
                    </TouchableOpacity>
                }
                rightColumn={<View style={styles.emptyContainer} />}
            />
            <View
                style={styles.contentContainer}
                onLayout={({
                    nativeEvent: {
                        layout: { width },
                    },
                }) => setElementWidth(width)}
            />
            <FlatList
                data={reviews}
                contentContainerStyle={styles.contentContainer}
                numColumns={NUM_COLUMNS}
                ListEmptyComponent={
                    isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <Text>No recent ratings</Text>
                    )
                }
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.pubContainer}
                        onPress={() =>
                            navigation.navigate('PubHome', {
                                screen: 'PubView',
                                params: {
                                    pubId: item.pub.id,
                                },
                            })
                        }>
                        <Image
                            source={pubImage(item.pub.primary_photo)}
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
                                amount={item.rating}
                                size={12}
                                color={'rgba(0, 0, 0, 0.4)'}
                            />
                        </View>
                    </Pressable>
                )}
            />
        </SafeAreaView>
    );
}

const ICON_PADDING = 10;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backContainer: {
        paddingLeft: ICON_PADDING,
    },
    emptyContainer: {
        flexBasis: 32,
    },
    contentContainer: {
        marginHorizontal: 10,
        marginTop: 5,
    },
    pubContainer: {
        marginBottom: 10,
    },
    pubImage: {
        marginHorizontal: IMAGE_PADDING,
        borderRadius: 2,
    },
    starsContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
});
