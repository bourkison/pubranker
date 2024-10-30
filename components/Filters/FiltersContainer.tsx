import React from 'react';
import { StyleSheet, View } from 'react-native';
import SearchBar from '@/components/Filters/SearchBar';
import FiltersScrollable from '@/components/Filters/FiltersScrollable';
import { useSharedExploreContext } from '@/context/exploreContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
} from 'react-native-reanimated';

export default function FiltersContainer() {
    const { setFilterBarHeight, filterBarHeight, mapBottomSheetAnimatedValue } =
        useSharedExploreContext();
    const insets = useSafeAreaInsets();

    const rStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            mapBottomSheetAnimatedValue.value,
            [filterBarHeight + 150, filterBarHeight],
            ['rgba(255, 255, 255, 0)', 'rgb(242, 242, 242)'],
        ),
    }));

    return (
        <Animated.View
            style={[rStyle, { paddingTop: insets.top }]}
            onLayout={e => setFilterBarHeight(e.nativeEvent.layout.height)}>
            <View>
                <SearchBar />
                <View style={styles.scrollableContainer}>
                    <FiltersScrollable />
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    scrollableContainer: {
        marginTop: 15,
        marginHorizontal: 10,
    },
});
