import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { BottomSheetStackParamList } from '@/nav/BottomSheetNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import PubReviews from '@/components/Reviews/PubReviews';
import ImageScroller from '@/components/Utility/ImageScroller';
import { supabase } from '@/services/supabase';
import PubTopBar from '@/components/Pubs/PubTopBar';
import { useFocusEffect } from '@react-navigation/native';
import PubFeatures from '@/components/Pubs/PubFeatures';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { SelectedPub, setPub } from '@/store/slices/pub';
import DraughtBeersList from '@/components/Beers/DraughtBeersList';
import PubDetails from '@/components/Pubs/PubDetails';
import BottomSheetScrollView from '@/components/BottomSheet/BottomSheetScrollView';

export default function PubHome({
    route,
}: StackScreenProps<BottomSheetStackParamList, 'PubHome'>) {
    const [activePubId, setActivePubId] = useState(0);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const imageFlatListRef = useRef<FlatList>(null);

    const dispatch = useAppDispatch();

    const isLoading = useAppSelector(state => state.pub.isLoading);
    const pub = useAppSelector(state => state.pub.selectedPub);

    const loadImages = async (input: SelectedPub) => {
        let urls: string[] = [];
        setImageUrls([]);

        input.photos.forEach(photo => {
            const url = supabase.storage.from('pubs').getPublicUrl(photo);
            urls.push(url.data.publicUrl);
        });

        setImageUrls(urls);
    };

    const initialLoad = async () => {
        const response = await dispatch(
            setPub({ id: route.params.pubId }),
        ).unwrap();

        loadImages(response);
    };

    useFocusEffect(() => {
        if (
            (!pub || pub.id !== route.params.pubId) &&
            isLoading !== route.params.pubId
        ) {
            initialLoad();
        } else if (pub && activePubId !== pub.id) {
            setActivePubId(pub.id);

            if (imageFlatListRef?.current) {
                imageFlatListRef.current.scrollToOffset({
                    animated: false,
                    offset: 0,
                });
            }

            loadImages(pub);
        }
    });

    if (!pub && isLoading) {
        return (
            <View>
                <ActivityIndicator />
            </View>
        );
    }

    if (!pub) {
        return (
            <View>
                <Text>Something has gone wrong.</Text>
            </View>
        );
    }

    return (
        <BottomSheetScrollView>
            <View style={styles.contentContainer}>
                <View style={styles.descriptionContainer}>
                    <Text>{pub.google_overview}</Text>
                </View>
                <View style={styles.topBarContainer}>
                    <PubTopBar pub={pub} />
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
                    <DraughtBeersList pub={pub} />
                </View>

                <View style={styles.pubFeaturesContainer}>
                    <PubFeatures pub={pub} />
                </View>

                <View style={styles.reviewsContainer}>
                    <PubReviews pub={pub} />
                </View>

                <View>
                    <PubDetails pub={pub} />
                </View>
            </View>
        </BottomSheetScrollView>
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
});
