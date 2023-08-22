import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import PubReviews from '@/components/Reviews/PubReviews';
import ImageScroller from '@/components/Utility/ImageScroller';
import { supabase } from '@/services/supabase';
import PubTopBar from '@/components/Pubs/PubTopBar';
import PubFeatures from '@/components/Pubs/PubFeatures';
import DraughtBeersList from '@/components/Beers/DraughtBeersList';
import PubDetails from '@/components/Pubs/PubDetails';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { getBorough } from '@/services/geo';
import { parseLocation } from '@/services';
import { useAppDispatch } from '@/store/hooks';
import { toggleSave } from '@/store/slices/saved';
import { toggleSave as toggleExploreSave } from '@/store/slices/explore';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PubHome({
    route,
    navigation,
}: StackScreenProps<MainNavigatorStackParamList, 'PubView'>) {
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const imageFlatListRef = useRef<FlatList>(null);

    const dispatch = useAppDispatch();

    const safeAreaInsets = useSafeAreaInsets();

    useEffect(() => {
        let urls: string[] = [];
        setImageUrls([]);

        route.params.pub.photos.forEach(photo => {
            const url = supabase.storage.from('pubs').getPublicUrl(photo);
            urls.push(url.data.publicUrl);
        });

        setImageUrls(urls);
    }, [route]);

    const displayAddress = useMemo(() => {
        return `${route.params.pub.address.split(', ')[0]}, ${getBorough(
            parseLocation(route.params.pub.location),
        )}`;
    }, [route.params.pub]);

    const save = async () => {
        navigation.setParams({
            pub: {
                ...route.params.pub,
                saved: !route.params.pub.saved,
            },
        });

        dispatch(
            toggleSave({
                id: route.params.pub.id,
                saved: route.params.pub.saved,
            }),
        );
        dispatch(toggleExploreSave({ id: route.params.pub.id }));
    };

    return (
        <View>
            <ScrollView>
                <View
                    style={[
                        styles.headerContainer,
                        { paddingTop: safeAreaInsets.top },
                    ]}>
                    <View style={styles.titleSubTitleContainer}>
                        <Text style={styles.title}>
                            {route.params.pub.name}
                        </Text>
                        <Text style={styles.subtitle}>{displayAddress}</Text>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.likeButton}
                            onPress={save}>
                            {route.params.pub.saved ? (
                                <Ionicons
                                    name="heart"
                                    size={18}
                                    color="#dc2626"
                                />
                            ) : (
                                <Ionicons
                                    name="heart-outline"
                                    size={18}
                                    color="#dc2626"
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.descriptionContainer}>
                        <Text>{route.params.pub.google_overview}</Text>
                    </View>
                    <View style={styles.topBarContainer}>
                        <PubTopBar pub={route.params.pub} />
                    </View>

                    <View style={styles.imageScrollerContainer}>
                        <ImageScroller
                            imageFlatListRef={imageFlatListRef}
                            images={imageUrls || []}
                            height={220}
                            width={220}
                            margin={5}
                        />
                    </View>

                    <View style={styles.draughtContainer}>
                        <DraughtBeersList pub={route.params.pub} />
                    </View>

                    <View style={styles.pubFeaturesContainer}>
                        <PubFeatures pub={route.params.pub} />
                    </View>

                    <View style={styles.reviewsContainer}>
                        <PubReviews pub={route.params.pub} />
                    </View>

                    <View>
                        <PubDetails pub={route.params.pub} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    contentContainer: {
        width: '100%',
    },

    descriptionContainer: {
        paddingHorizontal: 10,
        marginTop: 10,
    },
    topBarContainer: { marginVertical: 5 },
    imageScrollerContainer: { marginTop: 10 },
    draughtContainer: {
        marginTop: 20,
    },
    pubFeaturesContainer: {
        marginTop: 20,
    },
    reviewsContainer: {
        marginTop: 25,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
        backgroundColor: 'white',
    },
    titleSubTitleContainer: {
        marginLeft: 10,
        flexDirection: 'column',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 12,
        color: '#A3A3A3',
    },
    buttonsContainer: {
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -10,
    },
    likeButton: {
        marginRight: 4,
    },
    closeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 0,
        },
    },
});
