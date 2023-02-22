import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPubs, setSearchText } from '@/store/slices/discoverPubs';
import React, { useCallback, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Text,
    ActivityIndicator,
} from 'react-native';
import DiscoverPub from '@/components/Pubs/DiscoverPub';
import { setBottomBarState } from '@/store/slices/pub';
import FilterScroller from '@/components/Utility/FilterScroller';

const LOAD_AMOUNT = 10;

export default function Discover() {
    const dispatch = useAppDispatch();

    const pubs = useAppSelector(state => state.discoverPubs.pubs);
    const isLoading = useAppSelector(state => state.discoverPubs.isLoading);

    const search = useCallback(async () => {
        await dispatch(fetchPubs({ amount: LOAD_AMOUNT }));
    }, [dispatch]);

    useEffect(() => {
        search();
    }, [search]);

    return (
        <View>
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#A3A3A3"
                    returnKeyType="search"
                    onSubmitEditing={search}
                    onChangeText={s => dispatch(setSearchText(s))}
                    onFocus={() => dispatch(setBottomBarState('expanded'))}
                />
            </View>
            <View>
                <Text style={styles.subHeading}>Filters</Text>
                <FilterScroller pubLoadAmount={LOAD_AMOUNT} />
            </View>
            <View>
                <Text style={styles.subHeading}>Results</Text>
                {!isLoading ? (
                    <View>
                        {pubs.map(pub => (
                            <DiscoverPub pub={pub} key={pub.id} />
                        ))}
                    </View>
                ) : (
                    <ActivityIndicator />
                )}
            </View>
        </View>
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
    },
});
