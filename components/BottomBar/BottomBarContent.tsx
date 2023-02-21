import { useAppSelector } from '@/store/hooks';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomBarDiscover from '@/components/BottomBar/BottomBarDiscover';

export default function BottomBarContent() {
    const bottomBarType = useAppSelector(state => state.pub.bottomBarType);
    const selectedPub = useAppSelector(state => state.pub.selectedPub);

    if (
        bottomBarType === 'discover' ||
        (bottomBarType === 'selected' && !selectedPub)
    ) {
        return <BottomBarDiscover />;
    }

    if (bottomBarType === 'selected' && selectedPub) {
        return (
            <View>
                <Text style={styles.title}>{selectedPub.name}</Text>
                <Text>{selectedPub.google_overview}</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Content</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: '600',
    },
});