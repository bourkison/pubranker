import React from 'react';
import { ScrollView, FlatList, View, StyleSheet } from 'react-native';
import FilterItem from '@/components/Utility/FilterItem';
import { useAppSelector } from '@/store/hooks';
import { PubFilters } from '@/types';

type FilterScrollerProps = {
    pubLoadAmount: number;
    rows: number;
};

export default function FilterScroller({
    pubLoadAmount,
    rows,
}: FilterScrollerProps) {
    const filters = useAppSelector(state => state.discoverPubs.filters);
    const filterKeys = Object.keys(filters) as unknown as Array<
        keyof PubFilters
    >;

    return (
        <ScrollView
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <FlatList
                data={filterKeys}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                numColumns={Math.ceil(filterKeys.length / rows)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.rowMargin}>
                        <FilterItem type={item} pubLoadAmount={pubLoadAmount} />
                    </View>
                )}
                contentContainerStyle={styles.filtersContainer}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    filtersContainer: { marginTop: 10, paddingHorizontal: 15 },
    rowMargin: { marginBottom: 5 },
});
