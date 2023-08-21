import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '@/store/hooks';
import { setState } from '@/store/slices/explore';

export default function ViewMapButton() {
    const dispatch = useAppDispatch();

    const openMap = () => {
        // TODO: Load pubs in if no pubs loaded in yet.
        dispatch(setState('map'));
    };

    return (
        <Pressable style={styles.container} onPress={openMap}>
            <View>
                <Ionicons name="map-outline" size={18} color="#FFF" />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#384D48',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.4,
    },
    textContainer: {
        marginLeft: 2,
    },
    text: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
});
