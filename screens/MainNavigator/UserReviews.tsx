import UserReview from '@/components/Reviews/UserReview';
import Header from '@/components/Utility/Header';
import { ListReviewType, reviewListQuery } from '@/services/queries/review';
import { RootStackScreenProps } from '@/types/nav';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function UserReviews({
    route,
    navigation,
}: RootStackScreenProps<'UserReviews'>) {
    const [reviews, setReviews] = useState<ListReviewType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const { data, error } = await reviewListQuery()
                .eq('user_id', route.params.userId)
                .neq('content', null);

            if (error) {
                console.error(error);
                setIsLoading(false);
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
                        style={styles.backContainer}
                        onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-outline" size={14} />
                    </TouchableOpacity>
                }
                rightColumn={<View style={styles.emptyContainer} />}
            />

            <FlatList
                ListEmptyComponent={
                    isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <View>
                            <Text>No reviews.</Text>
                        </View>
                    )
                }
                data={reviews}
                renderItem={({ item }) => <UserReview review={item} />}
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
});
