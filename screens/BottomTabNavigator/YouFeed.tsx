import FeedListItem from '@/components/Feed/FeedListItem';
import { FeedType, getUserFeedQuery } from '@/services/queries/feed';
import { supabase } from '@/services/supabase';
import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { FlatList, ActivityIndicator, View, Text } from 'react-native';

type YouFeedProps = {
    feed: FeedType[];
    setFeed: Dispatch<SetStateAction<FeedType[]>>;
    hasLoaded: boolean;
    setHasLoaded: Dispatch<SetStateAction<boolean>>;
};

export default function YouFeed({ feed, setFeed }: YouFeedProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

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

            const { data, error } = await getUserFeedQuery(
                userData.user.id,
            ).order('updated_at', { ascending: false });

            if (error) {
                console.error(error);
                setIsLoading(false);
                return;
            }

            // @ts-ignore
            setFeed(data);
            setIsLoading(false);
        })();
    }, [setFeed]);

    const refresh = useCallback(async () => {
        setIsRefreshing(true);

        const { data: userData, error: userError } =
            await supabase.auth.getUser();

        if (userError) {
            console.error(userError);
            setIsRefreshing(false);
            return;
        }

        const { data, error } = await getUserFeedQuery(userData.user.id).order(
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
    }, [setFeed]);

    return (
        <FlatList
            data={feed}
            refreshing={isRefreshing}
            onRefresh={refresh}
            ListEmptyComponent={
                isLoading ? (
                    <ActivityIndicator />
                ) : (
                    <View>
                        <Text>Nothing in feed, rate pubs.</Text>
                    </View>
                )
            }
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <FeedListItem feedItem={item} />}
        />
    );
}
