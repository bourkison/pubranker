import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchMoreDiscoverPubs,
    fetchDiscoverPubs,
} from '@/store/slices/discover';
import React, { useCallback, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import DiscoverPub from '@/components/Pubs/DiscoverPub';
import FilterScroller from '@/components/Utility/FilterScroller';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import SearchBar from '@/components/Utility/SearchBar';
import { setPub } from '@/store/slices/pub';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetStackParamList } from '@/nav/BottomSheetNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import { DiscoveredPub } from '@/types';

const LOAD_AMOUNT = 5;

export default function Discover() {
    const dispatch = useAppDispatch();
    const FlatListRef = useRef<FlatList>(null);
    // const { collapse, animatedIndex } = useBottomSheet();

    const pubs = useAppSelector(state => state.discover.pubs);
    const isLoading = useAppSelector(state => state.discover.isLoading);
    const isLoadingMore = useAppSelector(state => state.discover.isLoadingMore);
    const moreToLoad = useAppSelector(state => state.discover.moreToLoad);

    const navigation =
        useNavigation<StackNavigationProp<BottomSheetStackParamList>>();

    const { expand } = useBottomSheet();

    // const selectedPub = useAppSelector(state => state.pub.selectedPub);

    // TODO: Fix this up.
    // useEffect(() => {
    //     console.log('CHANGED:', bottomBarType, animatedIndex.value);

    //     if (bottomBarType === 'discover' && animatedIndex.value === -1) {
    //         console.log('COLLAPSE');
    //         collapse();
    //     } else if (
    //         bottomBarType === 'selected' &&
    //         selectedPub &&
    //         animatedIndex.value !== -1
    //     ) {
    //         if (FlatListRef && FlatListRef.current) {
    //             FlatListRef.current.scrollToOffset({
    //                 offset: 0,
    //                 animated: true,
    //             });
    //         }
    //     }
    // }, [bottomBarType, collapse, animatedIndex, selectedPub]);

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
        dispatch(setPub({ pub, reference: 'discover' }));
        navigation.navigate('PubView');
        expand();
    };

    return (
        <BottomSheetFlatList
            // @ts-ignore
            ref={FlatListRef}
            ListEmptyComponent={() =>
                isLoading ? <ActivityIndicator /> : <View />
            }
            ListHeaderComponent={() => (
                <View>
                    <SearchBar search={search} />
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
