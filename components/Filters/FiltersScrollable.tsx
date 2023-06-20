import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import NearFilter from '@/components/Filters/NearFilter';

export default function FiltersScrollable() {
    return (
        <ScrollView
            horizontal={true}
            bounces={false}
            style={styles.container}
            showsHorizontalScrollIndicator={false}>
            <NearFilter />
            <NearFilter />
            <NearFilter />
            <NearFilter />
            <NearFilter />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'visible',
    },
});
