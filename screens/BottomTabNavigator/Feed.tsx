import FeedListItem from '@/components/Feed/FeedListItem';
import { FeedType, getFeedQuery } from '@/services/queries/feed';
import { supabase } from '@/services/supabase';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

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
            <View style={styles.headerContainer}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Feed</Text>
                </View>
            </View>
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
    headerContainer: {
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Jost',
        textAlign: 'center',
    },
});
