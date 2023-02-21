import { distanceString } from '@/services';
import { PubType } from '@/types';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '@/store/hooks';
import { deselectPub } from '@/store/slices/pub';

type BottomBarPubViewProps = {
    pub: PubType;
};

export default function BottomBarPubView({ pub }: BottomBarPubViewProps) {
    const dispatch = useAppDispatch();

    return (
        <View>
            <View style={styles.headerContainer}>
                <View style={styles.titleSubTitleContainer}>
                    <Text style={styles.title}>{pub.name}</Text>
                    <Text style={styles.subtitle}>
                        {distanceString(pub.dist_meters)}
                    </Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <View style={styles.likeButton}>
                        <Ionicons
                            name="heart-outline"
                            size={18}
                            color="#dc2626"
                        />
                    </View>
                    <Pressable
                        onPress={() => dispatch(deselectPub())}
                        style={styles.closeButton}>
                        <Octicons name="x" color="#A3A3A3" size={18} />
                    </Pressable>
                </View>
            </View>
            <Text>{pub.google_overview}</Text>
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
