import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import FilterItem from '@/components/Filters/FilterItem';
import SearchSuggestionItem from '@/components/Search/SearchSuggestionItem';

// TODO: Load in landmarks and list them out.

export default function NearFilter() {
    return (
        <FilterItem
            buttonContent="Near you"
            withBottomBar={true}
            bottomSheetContent={
                <View style={styles.bottomSheetContainer}>
                    <View>
                        <Text style={styles.bottomSheetHeader}>Near</Text>
                        <SearchSuggestionItem type="nearby" title="You" />

                        <SearchSuggestionItem
                            type="park"
                            title="Hackney Downs"
                        />
                        <SearchSuggestionItem
                            type="station"
                            title="Hackney Central"
                        />
                        <SearchSuggestionItem
                            type="station"
                            title="Hackney Downs"
                        />
                    </View>
                </View>
            }
            snapPoints={['80%']}
        />
    );
}

const styles = StyleSheet.create({
    bottomSheetContainer: {
        paddingHorizontal: 15,
    },
    bottomSheetHeader: {
        fontSize: 22,
        fontWeight: '600',
    },
});
