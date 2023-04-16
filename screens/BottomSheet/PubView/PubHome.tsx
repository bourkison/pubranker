import { parseLocation } from '@/services';
import React, { useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deselectPub, toggleSave as toggleMapSave } from '@/store/slices/pub';
import { toggleSave } from '@/store/slices/saved';
import { toggleSave as toggleDiscoverSave } from '@/store/slices/discover';

import { BottomSheetStackParamList } from '@/nav/BottomSheetNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import PubReviews from '@/components/Pubs/PubReviews';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import ImageScroller from '@/components/Utility/ImageScroller';
import { supabase } from '@/services/supabase';
import TopBarPub from '@/components/Pubs/TopBarPub';
import { useFocusEffect } from '@react-navigation/native';
import { getBorough } from '@/services/geo';
import PubFeatures from '@/components/Pubs/PubFeatures';

export default function PubHome({
    route,
    navigation,
}: StackScreenProps<BottomSheetStackParamList, 'PubHome'>) {
    const dispatch = useAppDispatch();
    const reference = useAppSelector(state => state.pub.selectedPubReference);

    const [activePubId, setActivePubId] = useState(0);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const imageFlatListRef = useRef<FlatList>(null);

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
        dispatch(toggleMapSave());

        if (reference === 'discover') {
            dispatch(toggleDiscoverSave({ id: route.params.pub.id }));
        }
    };

    const loadImages = async () => {
        let urls: string[] = [];
        setImageUrls([]);

        route.params.pub.photos.forEach(photo => {
            const url = supabase.storage.from('pubs').getPublicUrl(photo);
            urls.push(url.data.publicUrl);
        });

        setImageUrls(urls);
    };

    useFocusEffect(() => {
        if (activePubId !== route.params.pub.id) {
            setActivePubId(route.params.pub.id);

            if (imageFlatListRef?.current) {
                imageFlatListRef.current.scrollToOffset({
                    animated: false,
                    offset: 0,
                });
            }

            loadImages();
        }
    });

    return (
        <BottomSheetScrollView>
            <View style={styles.headerContainer}>
                <View style={styles.titleSubTitleContainer}>
                    <Text style={styles.title}>{route.params.pub.name}</Text>
                    <Text style={styles.subtitle}>{displayAddress}</Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.likeButton} onPress={save}>
                        {route.params.pub.saved ? (
                            <Ionicons name="heart" size={18} color="#dc2626" />
                        ) : (
                            <Ionicons
                                name="heart-outline"
                                size={18}
                                color="#dc2626"
                            />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            dispatch(deselectPub());
                            navigation.navigate('Discover');
                        }}
                        style={styles.closeButton}>
                        <Octicons name="x" color="#A3A3A3" size={18} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.descriptionContainer}>
                    <Text>{route.params.pub.google_overview}</Text>
                </View>
                <View style={styles.topBarContainer}>
                    <TopBarPub pub={route.params.pub} />
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

                <View style={styles.pubFeaturesContainer}>
                    <PubFeatures pub={route.params.pub} />
                </View>

                <View style={styles.reviewsContainer}>
                    <PubReviews pub={route.params.pub} />
                </View>

                <View style={styles.reviewButtonContainer}>
                    <TouchableOpacity
                        style={styles.reviewButton}
                        onPress={() =>
                            navigation.navigate('CreateReview', {
                                pub: route.params.pub,
                            })
                        }>
                        <Text style={styles.reviewButtonText}>
                            Review This Pub
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheetScrollView>
    );
}
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        marginBottom: 5,
        justifyContent: 'space-between',
    },
    contentContainer: {
        width: '100%',
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
    descriptionContainer: {
        paddingHorizontal: 10,
        marginTop: 10,
    },
    topBarContainer: { marginVertical: 5 },
    imageScrollerContainer: { marginTop: 10 },
    pubFeaturesContainer: {
        marginTop: 20,
    },
    reviewsContainer: {
        marginTop: 25,
    },
    reviewButtonContainer: {
        paddingHorizontal: 100,
        marginTop: 25,
    },
    reviewButton: {
        backgroundColor: '#2B5256',
        paddingVertical: 10,
        borderRadius: 5,
    },
    reviewButtonText: {
        color: '#F5F5F5',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
