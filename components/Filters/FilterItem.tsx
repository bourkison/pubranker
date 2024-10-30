import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Pressable,
} from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { PRIMARY_COLOR } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

type FilterItemProps = {
    buttonContent: JSX.Element | string;
    bottomSheetContent: JSX.Element;
    snapPoints: (number | string)[];
    withBottomBar?: boolean;
    onSearchPress?: () => void;
    onClearPress?: () => void;
};

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

export default function FilterItem({
    buttonContent,
    bottomSheetContent,
    snapPoints,
    withBottomBar = false,
    onSearchPress,
    onClearPress,
}: FilterItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const sRotationZ = useSharedValue(0);
    const rStyle = useAnimatedStyle(() => ({
        transform: [{ rotateZ: `${sRotationZ.value}deg` }],
    }));

    useEffect(() => {
        if (isExpanded) {
            sRotationZ.value = withTiming(180, {
                duration: 300,
                easing: Easing.inOut(Easing.quad),
            });
        } else {
            sRotationZ.value = withTiming(0, {
                duration: 300,
                easing: Easing.inOut(Easing.quad),
            });
        }
    }, [isExpanded, sRotationZ]);

    const expandBottomSheet = () => {
        setIsExpanded(true);

        if (bottomSheetRef && bottomSheetRef.current) {
            bottomSheetRef.current.present();
        }
    };

    const search = () => {
        if (onSearchPress) {
            onSearchPress();
        }

        setIsExpanded(false);

        if (bottomSheetRef && bottomSheetRef.current) {
            bottomSheetRef.current.dismiss();
        }
    };

    const clear = () => {
        if (onClearPress) {
            onClearPress();
        }

        setIsExpanded(false);

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
                    <AnimatedIonicons
                        style={[rStyle, styles.chevron]}
                        name="chevron-down-outline"
                        size={12}
                        color="#FFF"
                    />
                </View>
            </TouchableOpacity>
            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                onDismiss={() => setIsExpanded(false)}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
    chevron: {
        marginLeft: 2,
    },
});
