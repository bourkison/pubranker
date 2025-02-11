import { FeedType, getFeedQuery } from '@/services/queries/feed';
import { supabase } from '@/services/supabase';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';

export default function Feed() {
    const [feed, setFeed] = useState<FeedType[]>([]);

    useEffect(() => {
        (async () => {
            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                console.error(userError);
                return;
            }

            const { data, error } = await getFeedQuery(userData.user.id);

            if (error) {
                console.error(error);
                return;
            }

            console.log('data', JSON.stringify(data));
            setFeed(data);
        })();
    }, []);

    return (
        <SafeAreaView>
            <Text>Feed</Text>
        </SafeAreaView>
    );
}
