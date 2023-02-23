import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPubs } from '@/store/slices/discoverPubs';
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
import { BottomSheetFlatList, useBottomSheet } from '@gorhom/bottom-sheet';
import SearchBar from '@/components/Utility/SearchBar';

const LOAD_AMOUNT = 10;

export default function Discover() {
    const dispatch = useAppDispatch();
    const FlatListRef = useRef<FlatList>(null);
    const { collapse, animatedIndex, close } = useBottomSheet();

    const pubs = useAppSelector(state => state.discoverPubs.pubs);
    const isLoading = useAppSelector(state => state.discoverPubs.isLoading);

    const bottomBarType = useAppSelector(state => state.pub.bottomBarType);
    const selectedPub = useAppSelector(state => state.pub.selectedPub);

    useEffect(() => {
        if (bottomBarType === 'discover' && animatedIndex.value === -1) {
            collapse();
        } else if (
            bottomBarType === 'selected' &&
            selectedPub &&
            animatedIndex.value !== -1
        ) {
            close();

            if (FlatListRef && FlatListRef.current) {
                FlatListRef.current.scrollToOffset({
                    offset: 0,
                    animated: true,
                });
            }
        }
    }, [bottomBarType, collapse, animatedIndex, close, selectedPub]);

    // const isLoading = useAppSelector(state => state.discoverPubs.isLoading);

    const search = useCallback(async () => {
        await dispatch(fetchPubs({ amount: LOAD_AMOUNT }));
    }, [dispatch]);

    useEffect(() => {
        search();
    }, [search]);

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
            renderItem={({ item }) => <DiscoverPub pub={item} />}
            keyExtractor={item => item.id.toString()}
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
