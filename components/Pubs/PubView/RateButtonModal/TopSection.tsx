import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { PubSchema } from '@/types';
import { GOLD_RATINGS_COLOR } from '@/constants';

type TopSectionProps = {
    pub: PubSchema;
};

const ICON_SIZE = 40;

export default function TopSection({ pub }: TopSectionProps) {
    return (
        <View style={styles.container}>
            <View style={styles.column}>
                <Ionicons name="star-outline" size={ICON_SIZE} color={'#000'} />
                <Text style={styles.headerText}>Review</Text>
            </View>

            <View style={styles.column}>
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
            </View>

            <View style={styles.column}>
                <Feather name="plus" size={ICON_SIZE} color={'#000'} />
                <Text style={styles.headerText}>Add to List</Text>
            </View>
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
    },
});