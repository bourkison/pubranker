import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeedType, getUserFeedQuery } from '@/services/queries/feed';
import FeedListItem from '@/components/Feed/FeedListItem';
import { RootStackScreenProps } from '@/types/nav';

export default function UserActivity({
    navigation,
    route,
}: RootStackScreenProps<'UserActivity'>) {
    const [feed, setFeed] = useState<FeedType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const { data, error } = await getUserFeedQuery(
                route.params.userId,
            ).order('updated_at', { ascending: false });

            if (error) {
                setIsLoading(false);
                console.error(error);
                return;
            }
            // @ts-ignore
            setFeed(data);
        })();
    }, [route]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.backContainer}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={14} />
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Activity</Text>
                </View>

                <View style={styles.emptyContainer} />
            </View>

            <FlatList
                data={feed}
                ListEmptyComponent={
                    isLoading ? (
                        <View>
                            <ActivityIndicator />
                        </View>
                    ) : (
                        <View>
                            <Text>No recent activity</Text>
                        </View>
                    )
                }
                renderItem={({ item }) => <FeedListItem feedItem={item} />}
                keyExtractor={item => item.id.toString()}
            />
        </SafeAreaView>
    );
}

const ICON_PADDING = 10;

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
    backContainer: {
        paddingLeft: ICON_PADDING,
    },
    emptyContainer: {
        flexBasis: 32,
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
