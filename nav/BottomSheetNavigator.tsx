import React, { useMemo, RefObject } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, {
    BottomSheetBackdrop,
    useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import Discover from '@/screens/BottomSheet/Discover';
import PubView from '@/screens/BottomSheet/PubView';

type BottomSheetNavigatorProps = {
    discoverSheetRef: RefObject<BottomSheet>;
    selectedSheetRef: RefObject<BottomSheet>;
};

export default function BottomSheetNavigator({
    discoverSheetRef,
    selectedSheetRef,
}: BottomSheetNavigatorProps) {
    const snapPoints = useMemo(() => ['10%', '50%', '90%'], []);

    const animationConfigs = useBottomSheetSpringConfigs({
        damping: 10,
        stiffness: 100,
        mass: 0.6,
    });

    return (
        <>
            <BottomSheet
                ref={discoverSheetRef}
                snapPoints={snapPoints}
                overDragResistanceFactor={0.1}
                enableOverDrag={true}
                backdropComponent={props => (
                    <BottomSheetBackdrop
                        {...props}
                        appearsOnIndex={2}
                        disappearsOnIndex={1}
                        pressBehavior="collapse"
                    />
                )}
                index={1}
                animationConfigs={animationConfigs}
                handleComponent={() => (
                    <View style={styles.handleContainer}>
                        <View style={styles.handle} />
                    </View>
                )}>
                <Discover />
            </BottomSheet>
            <BottomSheet
                ref={selectedSheetRef}
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
                <PubView />
            </BottomSheet>
        </>
    );
}

const styles = StyleSheet.create({
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
