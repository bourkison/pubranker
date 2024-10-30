import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { PubSchema } from '@/types';

type TopSectionProps = {
    pub: PubSchema;
};

const ICON_SIZE = 40;

export default function TopSection({ pub }: TopSectionProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.column}>
                {pub.saved ? (
                    <Ionicons name="heart" size={ICON_SIZE} color="#dc2626" />
                ) : (
                    <Ionicons
                        name="heart-outline"
                        size={ICON_SIZE}
                        color="#dc2626"
                    />
                )}
                <Text style={styles.headerText}>Favourite</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.column}>
                <Feather name="plus" size={ICON_SIZE} color={'#000'} />
                <Text style={styles.headerText}>Add to List</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.column}>
                <Ionicons
                    name="share-outline"
                    size={ICON_SIZE}
                    color={'#000'}
                />
                <Text style={styles.headerText}>Share</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 20,
    },
    column: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        marginTop: 5,
        fontWeight: '300',
        fontSize: 12,
    },
});
