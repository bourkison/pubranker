import React, { useRef } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Pressable,
} from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { PRIMARY_COLOR } from '@/constants';

type FilterItemProps = {
    buttonContent: JSX.Element | string;
    bottomSheetContent: JSX.Element;
    snapPoints: (number | string)[];
    withBottomBar?: boolean;
    onSearchPress?: () => void;
    onClearPress?: () => void;
};

export default function FilterItem({
    buttonContent,
    bottomSheetContent,
    snapPoints,
    withBottomBar = false,
    onSearchPress,
    onClearPress,
}: FilterItemProps) {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const expandBottomSheet = () => {
        if (bottomSheetRef && bottomSheetRef.current) {
            bottomSheetRef.current.present();
        }
    };

    const search = () => {
        if (onSearchPress) {
            onSearchPress();
        }

        if (bottomSheetRef && bottomSheetRef.current) {
            bottomSheetRef.current.dismiss();
        }
    };

    const clear = () => {
        if (onClearPress) {
            onClearPress();
        }

        if (bottomSheetRef && bottomSheetRef.current) {
            bottomSheetRef.current.dismiss();
        }
    };

    return (
        <>
            <TouchableOpacity onPress={expandBottomSheet}>
                <View style={styles.container}>
                    {typeof buttonContent === 'string' ? (
                        <Text style={styles.filterText}>{buttonContent}</Text>
                    ) : (
                        buttonContent
                    )}
                </View>
            </TouchableOpacity>
            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                backdropComponent={props => (
                    <BottomSheetBackdrop
                        {...props}
                        pressBehavior="close"
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                        opacity={0.5}
                    />
                )}>
                <View style={styles.bottomSheetContentContainer}>
                    {bottomSheetContent}
                    {withBottomBar ? (
                        <View style={styles.bottomBarContainer}>
                            <Pressable onPress={clear}>
                                <Text style={styles.clearText}>Clear</Text>
                            </Pressable>
                            <Pressable
                                onPress={search}
                                style={styles.searchButton}>
                                <Text style={styles.searchText}>Search</Text>
                            </Pressable>
                        </View>
                    ) : undefined}
                </View>
            </BottomSheetModal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            height: 0,
            width: 0,
        },
        backgroundColor: PRIMARY_COLOR,
        marginHorizontal: 5,
    },
    filterText: {
        color: '#fff',
        fontSize: 12,
    },
    bottomSheetContentContainer: {
        justifyContent: 'space-between',
        flex: 1,
    },
    bottomBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    clearText: {
        color: PRIMARY_COLOR,
        textDecorationColor: PRIMARY_COLOR,
        textDecorationLine: 'underline',
        fontWeight: '600',
        fontSize: 16,
    },
    searchButton: {
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#292935',
    },
    searchText: {
        color: '#D8D4D5',
        fontSize: 16,
        fontWeight: '600',
    },
});
