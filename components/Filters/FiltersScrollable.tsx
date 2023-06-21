import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import NearFilter from '@/components/Filters/NearFilter';
import RangeFilter from '@/components/Filters/RangeFilter';

export default function FiltersScrollable() {
    return (
        <ScrollView
            horizontal={true}
            bounces={false}
            style={styles.container}
            showsHorizontalScrollIndicator={false}>
            <NearFilter />
            <RangeFilter />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'visible',
    },
});
