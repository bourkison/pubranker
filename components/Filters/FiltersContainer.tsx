import React from 'react';
import { StyleSheet, View } from 'react-native';
import SearchBar from '@/components/Filters/SearchBar';
import FiltersScrollable from '@/components/Filters/FiltersScrollable';
import { useSharedExploreContext } from '@/context/exploreContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FiltersContainer() {
    const { setFilterBarHeight } = useSharedExploreContext();
    const insets = useSafeAreaInsets();

    return (
        <View
            onLayout={e =>
                setFilterBarHeight(e.nativeEvent.layout.height + insets.top)
            }>
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
