import React, { useRef, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import HomeMap from '@/components/Maps/HomeMap';
import BottomSheet, {
    BottomSheetBackdrop,
    useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import BottomSheetNavigator from '@/nav/BottomSheetNavigator';

export default function Home() {
    const { height } = useWindowDimensions();
    const bottomSheetRef = useRef<BottomSheet>(null);

    const snapPoints = useMemo(() => ['10%', '40%', '90%'], []);

    const animationConfigs = useBottomSheetSpringConfigs({
        damping: 10,
        stiffness: 100,
        mass: 0.6,
    });

    return (
        <View style={styles.container}>
            <HomeMap
                bottomPadding={height * 0.1 - 10}
                bottomSheetRef={bottomSheetRef}
            />
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={-1}
                overDragResistanceFactor={0.1}
                backdropComponent={props => (
                    <BottomSheetBackdrop
                        {...props}
                        appearsOnIndex={2}
                        disappearsOnIndex={1}
                        pressBehavior="collapse"
                    />
                )}
                enableOverDrag={true}
                animationConfigs={animationConfigs}
                handleComponent={() => (
                    <View style={styles.handleContainer}>
                        <View style={styles.handle} />
                    </View>
                )}>
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
