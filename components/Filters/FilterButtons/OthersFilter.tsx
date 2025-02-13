import React, { useEffect, useMemo, useState } from 'react';
import FilterItem from '@/components/Filters/FilterItem';
import { StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchExplorePubs,
    resetFilters,
    setAllFilters,
    setState,
} from '@/store/slices/explore';
import { INITIAL_SEARCH_AMOUNT } from '@/constants';
import PubFeature from '@/components/Pubs/PubView/Features/PubFeature';

const FEATURE_MARGIN_BOTTOM = 5;
const FEATURE_MARGIN_HORIZONTAL = 3;

export default function OthersFilter() {
    const dispatch = useAppDispatch();
    const storeFilters = useAppSelector(state => state.explore.filters);

    const [filters, setFilters] = useState(storeFilters);

    const setFilter = (val: boolean | null, key: keyof typeof filters) => {
        let temp = { ...filters };
        temp[key] = val;
        setFilters(temp);
    };

    const toggleFilter = (
        key: keyof typeof filters,
        currentVal: boolean | null,
    ) => {
        if (currentVal === null) {
            setFilter(true, key);
        } else if (currentVal === true) {
            setFilter(false, key);
        } else if (currentVal === false) {
            setFilter(null, key);
        }
    };

    const amountFilters = useMemo(() => {
        return Object.values(storeFilters).filter(f => f !== null).length;
    }, [storeFilters]);

    // Keep local in sync with store.
    useEffect(() => {
        setFilters(storeFilters);
    }, [storeFilters]);

    const onSearch = () => {
        dispatch(setAllFilters(filters));
        dispatch(fetchExplorePubs({ amount: INITIAL_SEARCH_AMOUNT }));
        dispatch(setState('map'));
    };

    return (
        <FilterItem
            buttonContent={
                amountFilters > 0
                    ? `${amountFilters} filter${
                          amountFilters > 1 ? 's' : ''
                      } selected`
                    : 'No filters'
            }
            onSearchPress={onSearch}
            onClearPress={() => dispatch(resetFilters())}
            withBottomBar={true}
            bottomSheetContent={
                <View style={styles.bottomSheetContainer}>
                    <View style={styles.headerContainer}>
                        <View>
                            <Text style={styles.bottomSheetHeader}>
                                Other Filters
                            </Text>
                        </View>
                    </View>
                    <View style={styles.contentContainer}>
                        <View style={styles.featuresContainer}>
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Reservable"
                                input={filters.reservable}
                                onPress={() =>
                                    toggleFilter(
                                        'reservable',
                                        filters.reservable,
                                    )
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Free Wifi"
                                input={filters.freeWifi}
                                onPress={() =>
                                    toggleFilter('freeWifi', filters.freeWifi)
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Dog Friendly"
                                input={filters.dogFriendly}
                                onPress={() =>
                                    toggleFilter(
                                        'dogFriendly',
                                        filters.dogFriendly,
                                    )
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Kid Friendly"
                                input={filters.kidFriendly}
                                onPress={() =>
                                    toggleFilter(
                                        'kidFriendly',
                                        filters.kidFriendly,
                                    )
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Rooftop"
                                input={filters.rooftop}
                                onPress={() =>
                                    toggleFilter('rooftop', filters.rooftop)
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Garden"
                                input={filters.garden}
                                onPress={() =>
                                    toggleFilter('garden', filters.garden)
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Pool Tables"
                                input={filters.poolTable}
                                onPress={() =>
                                    toggleFilter('poolTable', filters.poolTable)
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Darts"
                                input={filters.darts}
                                onPress={() =>
                                    toggleFilter('darts', filters.darts)
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Foosball"
                                input={filters.foosball}
                                onPress={() =>
                                    toggleFilter('foosball', filters.foosball)
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Live Sport"
                                input={filters.liveSport}
                                onPress={() =>
                                    toggleFilter('liveSport', filters.liveSport)
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Wheelchair Accessible"
                                input={filters.wheelchairAccessible}
                                onPress={() =>
                                    toggleFilter(
                                        'wheelchairAccessible',
                                        filters.wheelchairAccessible,
                                    )
                                }
                            />
                        </View>
                    </View>
                </View>
            }
            snapPoints={[300]}
        />
    );
}

const styles = StyleSheet.create({
    bottomSheetContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'center',
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomSheetHeader: {
        fontSize: 22,
        fontWeight: '600',
    },
    contentContainer: {
        justifyContent: 'center',
        flex: 1,
    },
    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
