import FeedListItem from '@/components/Feed/FeedListItem';
import Header from '@/components/Utility/Header';
import { FeedType, getFeedQuery } from '@/services/queries/feed';
import { supabase } from '@/services/supabase';
import { HomeNavigatorBottomTabProps } from '@/types/nav';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';

export default function Feed({}: HomeNavigatorBottomTabProps<'Feed'>) {
    const [feed, setFeed] = useState<FeedType[]>([]);

    useEffect(() => {
        (async () => {
            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                console.error(userError);
                return;
            }

            const { data, error } = await getFeedQuery(userData.user.id).order(
                'updated_at',
                { ascending: false },
            );

            if (error) {
                console.error(error);
                return;
            }

            // @ts-ignore
            setFeed(data);
        })();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Header header="Feed" />
            <FlatList
                data={feed}
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
