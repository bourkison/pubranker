import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import NearFilter from '@/components/Filters/FilterButtons/NearFilter';
import RangeFilter from '@/components/Filters/FilterButtons/RangeFilter';
import RatingsFilter from '@/components/Filters/FilterButtons/RatingsFilter';
import OthersFilter from '@/components/Filters/FilterButtons/OthersFilter';
import SortFilter from '@/components/Filters/FilterButtons/SortFilter';
import BeerFilter from '@/components/Filters/FilterButtons/BeerFilter';

export default function FiltersScrollable() {
    return (
        <ScrollView
            horizontal={true}
            style={styles.container}
            showsHorizontalScrollIndicator={false}>
            <NearFilter />
            <RangeFilter />
            <RatingsFilter />
            <OthersFilter />
            <BeerFilter />
            <SortFilter />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'visible',
    },
});
