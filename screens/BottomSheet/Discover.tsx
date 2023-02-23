import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPubs, setSearchText } from '@/store/slices/discoverPubs';
import React, { useCallback, useEffect, useRef } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Text,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import DiscoverPub from '@/components/Pubs/DiscoverPub';
import FilterScroller from '@/components/Utility/FilterScroller';
import { BottomSheetFlatList, useBottomSheet } from '@gorhom/bottom-sheet';

const LOAD_AMOUNT = 10;

export default function Discover() {
    const dispatch = useAppDispatch();
    const FlatListRef = useRef<FlatList>(null);
    const { collapse, expand, animatedIndex, close } = useBottomSheet();

    const pubs = useAppSelector(state => state.discoverPubs.pubs);
    const searchText = useAppSelector(state => state.discoverPubs.searchText);
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
                    <View style={styles.searchBar}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search"
                            placeholderTextColor="#A3A3A3"
                            value={searchText}
                            returnKeyType="search"
                            onSubmitEditing={search}
                            onChangeText={s => dispatch(setSearchText(s))}
                            onFocus={() => expand()}
                            selectTextOnFocus={true}
                        />
                    </View>
                    <View>
                        <Text style={styles.subHeading}>Filters</Text>
                        <FilterScroller pubLoadAmount={LOAD_AMOUNT} />
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
    searchBar: {
        borderRadius: 7,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 10,
        marginHorizontal: 15,
    },
    searchInput: { width: '100%', paddingVertical: 8 },
    subHeading: {
        fontWeight: 'bold',
        color: '#A3A3A3',
        marginHorizontal: 15,
        marginTop: 15,
        marginBottom: 10,
    },
});
