import { distanceString } from '@/services';
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
import { deselectPub } from '@/store/slices/pub';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import { supabase } from '@/services/supabase';

export default function PubView() {
    const dispatch = useAppDispatch();
    const { animatedIndex, close, snapToIndex } = useBottomSheet();

    const bottomBarType = useAppSelector(state => state.pub.bottomBarType);
    const selectedPub = useAppSelector(state => state.pub.selectedPub);

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

    const savePub = async () => {
        if (!selectedPub) {
            return;
        }

        const { data, error } = await supabase.from('saves').insert({
            pub_id: selectedPub.id,
        });

        console.log('SAVE:', data, error);
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
                    <TouchableOpacity
                        style={styles.likeButton}
                        onPress={savePub}>
                        <Ionicons
                            name="heart-outline"
                            size={18}
                            color="#dc2626"
                        />
                    </TouchableOpacity>

                    <Pressable
                        onPress={() => dispatch(deselectPub())}
                        style={styles.closeButton}>
                        <Octicons name="x" color="#A3A3A3" size={18} />
                    </Pressable>
                </View>
            </View>
            <Text>{selectedPub.google_overview}</Text>
            <Text>{JSON.stringify(selectedPub.opening_hours)}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        marginBottom: 5,
        justifyContent: 'space-between',
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
});
