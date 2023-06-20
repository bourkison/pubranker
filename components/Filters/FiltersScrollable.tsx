import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import NearFilter from '@/components/Filters/NearFilter';

export default function FiltersScrollable() {
    return (
        <ScrollView horizontal={true} style={styles.container}>
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
