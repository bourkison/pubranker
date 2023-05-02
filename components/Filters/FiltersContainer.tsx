import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import SearchBar from '@/components/Filters/SearchBar';
import FiltersScrollable from '@/components/Filters/FiltersScrollable';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

type FiltersContainerProps = {
    heightPercentage: number;
};

export default function FiltersContainer({
    heightPercentage,
}: FiltersContainerProps) {
    const { height } = useWindowDimensions();
    const bottomTabBarHeight = useBottomTabBarHeight();

    return (
        <View>
            <View
                style={[
                    styles.container,
                    {
                        height:
                            (height - bottomTabBarHeight) * heightPercentage,
                    },
                ]}>
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
        justifyContent: 'flex-end',
        width: '100%',
    },
    scrollableContainer: {
        marginTop: 10,
    },
});
