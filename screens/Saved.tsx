import React, { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    SafeAreaView,
    FlatList,
    ActivityIndicator,
    View,
    Text,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import Unauthorized from '@/screens/Unauthorized';

import { fetchSavedPubs } from '@/store/slices/saved';

export default function SavedPubs() {
    const loggedIn = useAppSelector(state => state.user.loggedIn);
    const user = useAppSelector(state => state.user.docData);

    const isLoading = useAppSelector(state => state.saved.isLoading);
    const isRefreshing = useAppSelector(state => state.saved.isRefreshing);
    const savedPubs = useAppSelector(state => state.saved.pubs);

    const dispatch = useAppDispatch();

    const fetchPubs = useCallback(
        async (refreshing: boolean) => {
            if (!user) {
                return;
            }

            dispatch(fetchSavedPubs({ amount: 10, id: user.id, refreshing }));
        },
        [dispatch, user],
    );

    useEffect(() => {
        if (!loggedIn || !user) {
            return;
        }

        fetchPubs(false);
    }, [loggedIn, user, fetchPubs]);

    if (!loggedIn) {
        return <Unauthorized type="saved" />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ListEmptyComponent={
                    isLoading ? <ActivityIndicator /> : <View />
                }
                data={savedPubs}
                renderItem={({ item }) => <Text>{item.name}</Text>}
                keyExtractor={item => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        onRefresh={() => fetchPubs(true)}
                        refreshing={isRefreshing}
                    />
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
});
