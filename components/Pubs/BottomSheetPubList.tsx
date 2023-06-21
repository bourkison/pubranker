import { DiscoveredPub } from '@/types';
import React from 'react';
import BottomSheetPubItem from '@/components/Pubs/BottomSheetPubItem';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';

type BottomSheetPubListProps = {
    pubs: DiscoveredPub[];
};

export default function BottomSheetPubList({ pubs }: BottomSheetPubListProps) {
    const bottomTabBarHeight = useBottomTabBarHeight();

    return (
        <BottomSheetFlatList
            contentContainerStyle={{ paddingBottom: bottomTabBarHeight }}
            ListHeaderComponent={
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Pub Results</Text>
                </View>
            }
            data={pubs}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <BottomSheetPubItem pub={item} />}
        />
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 25,
        paddingBottom: 15,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
    },
});