import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchMoreDiscoverPubs,
    fetchDiscoverPubs,
} from '@/store/slices/discover';
import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import DiscoverPub from '@/components/Pubs/DiscoverPub';
import FilterScroller from '@/components/Utility/FilterScroller';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetStackParamList } from '@/nav/BottomSheetNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { DiscoveredPub } from '@/types';
import { FlatList } from 'react-native-gesture-handler';

const LOAD_AMOUNT = 5;

export default function Discover() {
    const dispatch = useAppDispatch();

    const pubs = useAppSelector(state => state.discover.pubs);
    const isLoading = useAppSelector(state => state.discover.isLoading);
    const isLoadingMore = useAppSelector(state => state.discover.isLoadingMore);
    const moreToLoad = useAppSelector(state => state.discover.moreToLoad);

    const navigation =
        useNavigation<StackNavigationProp<BottomSheetStackParamList>>();

    const search = useCallback(async () => {
        await dispatch(fetchDiscoverPubs({ amount: LOAD_AMOUNT }));
    }, [dispatch]);

    const loadMore = useCallback(async () => {
        if (!isLoading && !isLoadingMore && moreToLoad) {
            await dispatch(fetchMoreDiscoverPubs({ amount: LOAD_AMOUNT }));
        }
    }, [dispatch, isLoadingMore, isLoading, moreToLoad]);

    useEffect(() => {
        search();
    }, [search]);

    const selectPub = (pub: DiscoveredPub) => {
        navigation.navigate('PubHome', { pubId: pub.id });
    };

    return (
        <FlatList
            ListEmptyComponent={() =>
                isLoading ? <ActivityIndicator /> : <View />
            }
            ListHeaderComponent={() => (
                <View>
                    <View>
                        <Text style={styles.subHeading}>Filters</Text>
                        <FilterScroller pubLoadAmount={LOAD_AMOUNT} rows={3} />
                    </View>
                    <Text style={styles.subHeading}>Results</Text>
                </View>
            )}
            data={pubs}
            renderItem={({ item }) => (
                <DiscoverPub pub={item} onSelect={() => selectPub(item)} />
            )}
            keyExtractor={item => item.id.toString()}
            onEndReached={loadMore}
            ListFooterComponent={() =>
                isLoadingMore ? <ActivityIndicator /> : <View />
            }
        />
    );
}

const styles = StyleSheet.create({
    subHeading: {
        fontWeight: 'bold',
        color: '#A3A3A3',
        marginHorizontal: 15,
        marginTop: 15,
        marginBottom: 10,
    },
});
