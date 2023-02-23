import React, { useRef } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import HomeMap from '@/components/Maps/HomeMap';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetNavigator from '@/nav/BottomSheetNavigator';

export default function Home() {
    const { height } = useWindowDimensions();
    const discoverSheetRef = useRef<BottomSheet>(null);
    const selectedSheetRef = useRef<BottomSheet>(null);

    return (
        <View style={styles.container}>
            <HomeMap
                bottomPadding={height * 0.1 - 10}
                bottomSheetRef={discoverSheetRef}
            />
            <BottomSheetNavigator
                discoverSheetRef={discoverSheetRef}
                selectedSheetRef={selectedSheetRef}
            />
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
});
