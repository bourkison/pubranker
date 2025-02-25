import Header from '@/components/Utility/Header';
import { FeedType } from '@/services/queries/feed';
import { HomeNavigatorBottomTabProps } from '@/types/nav';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import FriendsFeed from './FriendsFeed';
import PageTabs from '@/components/Utility/PageTabs';
import YouFeed from './YouFeed';

export default function Feed({}: HomeNavigatorBottomTabProps<'Feed'>) {
    const [selectedPage, setSelectedPage] = useState(0);

    const [friendsFeed, setFriendsFeed] = useState<FeedType[]>([]);
    const [hasLoadedFriendsFeed, setHasLoadedFriendsFeed] = useState(false);

    const [youFeed, setYouFeed] = useState<FeedType[]>([]);
    const [hasLoadedYouFeed, setHasLoadedYouFeed] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <Header header="Feed" />

            <View style={styles.pagesContainer}>
                <PageTabs
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                    pages={[
                        {
                            title: 'Friends',
                            component: (
                                <FriendsFeed
                                    feed={friendsFeed}
                                    setFeed={setFriendsFeed}
                                    hasLoaded={hasLoadedFriendsFeed}
                                    setHasLoaded={setHasLoadedFriendsFeed}
                                />
                            ),
                        },
                        {
                            title: 'You',
                            component: (
                                <YouFeed
                                    feed={youFeed}
                                    setFeed={setYouFeed}
                                    hasLoaded={hasLoadedYouFeed}
                                    setHasLoaded={setHasLoadedYouFeed}
                                />
                            ),
                        },
                    ]}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pagesContainer: {
        flex: 1,
        width: '100%',
    },
});
