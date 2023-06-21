import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import NearFilter from '@/components/Filters/NearFilter';
import RangeFilter from '@/components/Filters/RangeFilter';
import RatingsFilter from '@/components/Filters/RatingsFilter';

export default function FiltersScrollable() {
    return (
        <ScrollView
            horizontal={true}
            style={styles.container}
            showsHorizontalScrollIndicator={false}>
            <NearFilter />
            <RangeFilter />
            <RatingsFilter />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'visible',
    },
});
