import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import FilterItem from '@/components/Filters/FilterItem';

export default function NearFilter() {
    return (
        <FilterItem
            ButtonContent={
                <View style={styles.container}>
                    <Text style={styles.filterText}>Nearby</Text>
                </View>
            }
            ModalContent={<View />}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            height: 0,
            width: 0,
        },
        backgroundColor: '#fff',
        marginHorizontal: 5,
    },
    filterText: {
        fontWeight: '500',
    },
});
