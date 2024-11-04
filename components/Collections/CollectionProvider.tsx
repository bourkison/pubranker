import { CollectionContext } from '@/context/collectionContext';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SECONDARY_COLOR } from '@/constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

type CollectionProviderProps = {
    children: JSX.Element;
};

const BOTTOM_PADDING_BOTTOM_TAB = 15;
const BOTTOM_PADDING_NO_TAB = 5;

export default function CollectionProvider({
    children,
}: CollectionProviderProps) {
    const [isOnBottomTabsPage, setIsOnBottomTabsPage] = useState(false);
    const [bottomTabHeight, setBottomTabHeight] = useState(0);
    const { bottom } = useSafeAreaInsets();

    const [selectedPub, setSelectedPub] = useState<null | number>(null);
    const [timer, setTimer] = useState<NodeJS.Timeout>();

    const showAddToCollection = useCallback((id: number, duration = 3000) => {
        setSelectedPub(id);

        const timeout = setTimeout(() => {
            setSelectedPub(null);
        }, duration);

        setTimer(timeout);
    }, []);

    useEffect(() => {
        return () => clearTimeout(timer);
    }, [timer]);

    return (
        <CollectionContext.Provider
            value={{
                showAddToCollection,
                setBottomTabHeight,
                setIsOnBottomTabsPage,
            }}>
            {children}
            {selectedPub !== null ? (
                <Animated.View
                    entering={FadeInDown}
                    exiting={FadeOutDown}
                    style={[
                        styles.container,
                        {
                            bottom: isOnBottomTabsPage
                                ? BOTTOM_PADDING_BOTTOM_TAB + bottomTabHeight
                                : BOTTOM_PADDING_NO_TAB + bottom,
                        },
                    ]}>
                    <View style={styles.textContainer}>
                        <View style={styles.leftTextContainer}>
                            <Ionicons name="heart" size={15} color="#dc2626" />
                            <Text style={styles.text}>
                                Favourited! Add to a list?
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.addTextContainer}>
                            <Feather
                                name="plus"
                                color={SECONDARY_COLOR}
                                size={15}
                            />
                            <Text style={styles.addText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            ) : undefined}
        </CollectionContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        paddingVertical: 5,
        zIndex: 3,
    },
    textContainer: {
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 15,
        fontWeight: '400',
        letterSpacing: -0.1,
        marginLeft: 5,
    },

    addTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addText: {
        fontSize: 15,
        color: SECONDARY_COLOR,
        fontWeight: '600',
    },
});
