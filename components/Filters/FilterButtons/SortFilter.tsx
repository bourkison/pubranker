import React from 'react';
import FilterItem from '@/components/Filters/FilterItem';
import { useAppSelector } from '@/store/hooks';
import { View, Text, StyleSheet } from 'react-native';

export default function SortFilter() {
    const sortBy = useAppSelector(state => state.explore.sortBy);

    return (
        <FilterItem
            buttonContent={`Sort by ${sortBy}`}
            snapPoints={[200]}
            withBottomBar={true}
            bottomSheetContent={
                <View style={styles.bottomSheetContainer}>
                    <View style={styles.headerContainer}>
                        <View>
                            <Text style={styles.bottomSheetHeader}>Sort</Text>
                        </View>
                    </View>
                </View>
            }
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
