import React from 'react';
import { StyleSheet, View } from 'react-native';
import SearchBar from '@/components/Filters/SearchBar';
import FiltersScrollable from '@/components/Filters/FiltersScrollable';

export default function FiltersContainer() {
    return (
        <View>
            <View>
                <SearchBar />
                <View style={styles.scrollableContainer}>
                    <FiltersScrollable />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    scrollableContainer: {
        marginTop: 15,
        marginHorizontal: 10,
    },
});
