import React from 'react';
import FilterItem from '@/components/Filters/FilterItem';
import { View, Text, StyleSheet } from 'react-native';

export default function BeerFilter() {
    return (
        <FilterItem
            buttonContent="Any beer"
            snapPoints={[400]}
            withBottomBar={true}
            bottomSheetContent={
                <View style={styles.bottomSheetContainer}>
                    <View style={styles.headerContainer}>
                        <View>
                            <Text style={styles.bottomSheetHeader}>Beers</Text>
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
