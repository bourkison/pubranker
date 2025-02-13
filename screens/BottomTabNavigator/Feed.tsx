import FeedListItem from '@/components/Feed/FeedListItem';
import Header from '@/components/Utility/Header';
import { FeedType, getFeedQuery } from '@/services/queries/feed';
import { supabase } from '@/services/supabase';
import { HomeNavigatorBottomTabProps } from '@/types/nav';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function Feed({}: HomeNavigatorBottomTabProps<'Feed'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [feed, setFeed] = useState<FeedType[]>([]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                console.error(userError);
                setIsLoading(false);
                return;
            }

            const { data, error } = await getFeedQuery(userData.user.id).order(
                'updated_at',
                { ascending: false },
            );

            if (error) {
                console.error(error);
                setIsLoading(false);
                return;
            }

            // @ts-ignore
            setFeed(data);
            setIsLoading(false);
        })();
    }, []);

    const refresh = useCallback(async () => {
        setIsRefreshing(true);

        const { data: userData, error: userError } =
            await supabase.auth.getUser();

        if (userError) {
            console.error(userError);
            setIsRefreshing(false);
            return;
        }

        const { data, error } = await getFeedQuery(userData.user.id).order(
            'updated_at',
            { ascending: false },
        );

        if (error) {
            console.error(error);
            setIsRefreshing(false);
            return;
        }

        // @ts-ignore
        setFeed(data);
        setIsRefreshing(false);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Header header="Feed" />
            <FlatList
                data={feed}
                refreshing={isRefreshing}
                onRefresh={refresh}
                ListEmptyComponent={
                    isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <View>
                            <Text>Nothing in feed, follow users.</Text>
                        </View>
                    )
                }
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <FeedListItem feedItem={item} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
