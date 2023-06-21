import React, { useMemo, useState } from 'react';
import FilterItem from '@/components/Filters/FilterItem';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import FilterToggleItem from './FilterToggleItem';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { BoolOrUnset } from '@/types';
import { resetFilters, setAllFilters } from '@/store/slices/explore';

export default function OthersFilter() {
    const dispatch = useAppDispatch();
    const storeFilters = useAppSelector(state => state.explore.filters);

    const [filters, setFilters] = useState(storeFilters);

    const setFilter = (val: BoolOrUnset, key: keyof typeof filters) => {
        let temp = { ...filters };
        temp[key] = val;
        setFilters(temp);
    };

    const toggleFilter = (
        key: keyof typeof filters,
        currentVal: BoolOrUnset,
    ) => {
        if (currentVal === 'unset') {
            setFilter(true, key);
        } else if (currentVal === true) {
            setFilter(false, key);
        } else if (currentVal === false) {
            setFilter('unset', key);
        }
    };

    const amountFilters = useMemo(() => {
        return Object.values(storeFilters).filter(f => f !== 'unset').length;
    }, [storeFilters]);

    const clear = () => {
        dispatch(resetFilters());
        setFilters({
            dogFriendly: 'unset',
            liveSport: 'unset',
            darts: 'unset',
            pool: 'unset',
            sundayRoast: 'unset',
            garden: 'unset',
            kidFriendly: 'unset',
            liveMusic: 'unset',
            boardGames: 'unset',
            freeWifi: 'unset',
            roof: 'unset',
            foosball: 'unset',
            wheelchairAccessible: 'unset',
        });
    };

    return (
        <FilterItem
            buttonContent={
                amountFilters > 0
                    ? `${amountFilters} filter${
                          amountFilters > 1 ? 's' : ''
                      } selected`
                    : 'Filters'
            }
            onSearchPress={() => dispatch(setAllFilters(filters))}
            onClearPress={clear}
            withBottomBar={true}
            bottomSheetContent={
                <ScrollView style={styles.bottomSheetContainer}>
                    <View style={styles.headerContainer}>
                        <View>
                            <Text style={styles.bottomSheetHeader}>
                                Other Filters
                            </Text>
                        </View>
                    </View>
                    <View>
                        <FilterToggleItem
                            title="Dog Friendly"
                            state={filters.dogFriendly}
                            onPress={() =>
                                toggleFilter('dogFriendly', filters.dogFriendly)
                            }
                        />
                        <FilterToggleItem
                            title="Beer Garden"
                            state={filters.garden}
                            onPress={() =>
                                toggleFilter('garden', filters.garden)
                            }
                        />
                        <FilterToggleItem
                            title="Live Sport"
                            state={filters.liveSport}
                            onPress={() =>
                                toggleFilter('liveSport', filters.liveSport)
                            }
                        />
                        <FilterToggleItem
                            title="Darts"
                            state={filters.darts}
                            onPress={() => toggleFilter('darts', filters.darts)}
                        />
                        <FilterToggleItem
                            title="Pool Tables"
                            state={filters.pool}
                            onPress={() => toggleFilter('pool', filters.pool)}
                        />
                        <FilterToggleItem
                            title="Foosball"
                            state={filters.foosball}
                            onPress={() =>
                                toggleFilter('foosball', filters.foosball)
                            }
                        />
                        <FilterToggleItem
                            title="Kid Friendly"
                            state={filters.kidFriendly}
                            onPress={() =>
                                toggleFilter('kidFriendly', filters.kidFriendly)
                            }
                        />
                        <FilterToggleItem
                            title="Board Games"
                            state={filters.boardGames}
                            onPress={() =>
                                toggleFilter('boardGames', filters.boardGames)
                            }
                        />
                        <FilterToggleItem
                            title="Free Wifi"
                            state={filters.freeWifi}
                            onPress={() =>
                                toggleFilter('freeWifi', filters.freeWifi)
                            }
                        />
                        <FilterToggleItem
                            title="Rooftop"
                            state={filters.roof}
                            onPress={() => toggleFilter('roof', filters.roof)}
                        />
                        <FilterToggleItem
                            title="Wheelchair Accessible"
                            state={filters.wheelchairAccessible}
                            onPress={() =>
                                toggleFilter(
                                    'wheelchairAccessible',
                                    filters.wheelchairAccessible,
                                )
                            }
                        />
                    </View>
                </ScrollView>
            }
            snapPoints={['80%']}
        />
    );
}

const styles = StyleSheet.create({
    bottomSheetContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
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
});
