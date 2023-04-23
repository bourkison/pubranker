import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import HomeMap from '@/components/Maps/HomeMap';
import BottomSheetNavigator from '@/nav/BottomSheetNavigator';
import FiltersContainer from '@/components/Filters/FiltersContainer';
import BottomSheet from '@/components/BottomSheet/BottomSheet';

export default function Home() {
    const { height } = useWindowDimensions();

    const snapPoints = useMemo(() => [0.1, 0.4, 0.9], []);

    return (
        <View style={styles.container}>
            <View style={styles.filtersContainer}>
                <FiltersContainer />
            </View>
            <HomeMap bottomPadding={height * 0.1 - 10} />
            <BottomSheet snapPoints={snapPoints} initialIndex={0}>
                <BottomSheetNavigator />
            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        backgroundColor: 'transparent',
    },
    filtersContainer: {
        position: 'absolute',
        top: 0,
        zIndex: 10,
        width: '100%',
    },
    handleContainer: {
        height: 4,
        marginTop: 10,
        marginBottom: 12,
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
    },
    handle: {
        width: 48,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        height: '100%',
        borderRadius: 10,
    },
});
