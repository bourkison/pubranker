import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RootStackScreenProps } from '@/types/nav';
import Header from '@/components/Utility/Header';

export default function CollectionComments({
    route,
}: RootStackScreenProps<'CollectionComments'>) {
    return (
        <View style={styles.container}>
            <Header header="Comments" />
            <Text>{route.params.collectionId}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
