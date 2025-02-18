import Header from '@/components/Utility/Header';
import { PubNavigatorStackProps } from '@/types/nav';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ListReviewType, reviewListQuery } from '@/services/queries/review';
import { supabase } from '@/services/supabase';
import uuid from 'react-native-uuid';
import Review from '@/components/Reviews/Review';
import { HEADER_ICON_SIZE } from '@/constants';

export default function PubReviewsView({
    route,
    navigation,
}: PubNavigatorStackProps<'PubReviewsView'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [reviews, setReviews] = useState<ListReviewType[]>([]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const { data: userData } = await supabase.auth.getUser();

            const { data, error } = await reviewListQuery()
                .eq('pub_id', route.params.pubId)
                // If not logged in, generate random UUID so this shows up as 0.
                .eq('liked.user_id', userData.user?.id || uuid.v4())
                .neq('content', null)
                .neq('content', '');

            if (error) {
                console.error(error);
                return;
            }

            setReviews(data);
            setIsLoading(false);
        })();
    }, [route]);

    return (
        <SafeAreaView style={styles.container}>
            <Header
                header="Reviews"
                leftColumn={
                    <TouchableOpacity
                        style={styles.settingsContainer}
                        onPress={() => navigation.goBack()}>
                        <Ionicons
                            name="arrow-back-outline"
                            size={HEADER_ICON_SIZE}
                        />
                    </TouchableOpacity>
                }
                rightColumn={
                    <TouchableOpacity style={styles.optionsContainer}>
                        <Ionicons name="options" size={HEADER_ICON_SIZE} />
                    </TouchableOpacity>
                }
            />

            <FlatList
                contentContainerStyle={styles.scrollableContainer}
                ListEmptyComponent={
                    isLoading ? <ActivityIndicator /> : <Text>No reviews</Text>
                }
                data={reviews}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item, index }) => (
                    <Review review={item} noBorder={index === 0} />
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
    scrollableContainer: {
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    settingsContainer: {
        paddingLeft: ICON_PADDING,
    },
    optionsContainer: {
        paddingRight: ICON_PADDING,
    },
});
