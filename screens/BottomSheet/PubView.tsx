import { distanceString, parseOpeningHours } from '@/services';
import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableOpacity,
} from 'react-native';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deselectPub, toggleSave as toggleMapSave } from '@/store/slices/pub';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import { toggleSave } from '@/store/slices/saved';
import { toggleSave as toggleDiscoverSave } from '@/store/slices/discover';
import OpeningHours from '@/components/Pubs/OpeningHours';

export default function PubView() {
    const dispatch = useAppDispatch();
    const { animatedIndex, close, snapToIndex } = useBottomSheet();

    const bottomBarType = useAppSelector(state => state.pub.bottomBarType);
    const selectedPub = useAppSelector(state => state.pub.selectedPub);
    const reference = useAppSelector(state => state.pub.selectedPubReference);

    useEffect(() => {
        if (
            bottomBarType === 'selected' &&
            selectedPub &&
            animatedIndex.value === -1
        ) {
            snapToIndex(1);
        } else if (bottomBarType === 'discover' && animatedIndex.value !== -1) {
            close();
        }
    }, [bottomBarType, snapToIndex, animatedIndex, close, selectedPub]);

    const save = async () => {
        if (!selectedPub) {
            return;
        }

        dispatch(toggleSave({ id: selectedPub.id, saved: selectedPub.saved }));
        dispatch(toggleMapSave());

        if (reference === 'discover') {
            dispatch(toggleDiscoverSave({ id: selectedPub.id }));
        }
    };

    if (!selectedPub) {
        return (
            <View>
                <Text>Error</Text>
            </View>
        );
    }

    return (
        <View>
            <View style={styles.headerContainer}>
                <View style={styles.titleSubTitleContainer}>
                    <Text style={styles.title}>{selectedPub.name}</Text>
                    <Text style={styles.subtitle}>
                        {distanceString(selectedPub.dist_meters)}
                    </Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.likeButton} onPress={save}>
                        {selectedPub.saved ? (
                            <Ionicons name="heart" size={18} color="#dc2626" />
                        ) : (
                            <Ionicons
                                name="heart-outline"
                                size={18}
                                color="#dc2626"
                            />
                        )}
                    </TouchableOpacity>

                    <Pressable
                        onPress={() => dispatch(deselectPub())}
                        style={styles.closeButton}>
                        <Octicons name="x" color="#A3A3A3" size={18} />
                    </Pressable>
                </View>
            </View>
            <View style={styles.contentContainer}>
                <Text>{selectedPub.google_overview}</Text>
                <View>
                    <View style={styles.openingHoursContainer}>
                        <OpeningHours
                            openingHours={parseOpeningHours(
                                selectedPub.opening_hours,
                            )}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        marginBottom: 5,
        justifyContent: 'space-between',
    },
    contentContainer: {
        width: '100%',
    },
    titleSubTitleContainer: {
        marginLeft: 10,
        flexDirection: 'column',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 16,
        color: '#A3A3A3',
    },
    buttonsContainer: {
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -10,
    },
    likeButton: {
        marginRight: 4,
    },
    closeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 0,
        },
    },
    openingHoursContainer: {
        maxWidth: 256,
    },
});
