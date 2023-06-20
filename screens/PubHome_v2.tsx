import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ScrollView,
    SafeAreaView,
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
import PubViewHeader from '@/components/Pubs/PubViewHeader';

export default function PubHome({
    route,
}: StackScreenProps<MainNavigatorStackParamList, 'PubView'>) {
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const imageFlatListRef = useRef<FlatList>(null);

    useEffect(() => {
        let urls: string[] = [];
        setImageUrls([]);

        route.params.pub.photos.forEach(photo => {
            const url = supabase.storage.from('pubs').getPublicUrl(photo);
            urls.push(url.data.publicUrl);
        });

        setImageUrls(urls);
    }, [route]);

    return (
        <SafeAreaView>
            <ScrollView>
                <PubViewHeader />
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
        </SafeAreaView>
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
