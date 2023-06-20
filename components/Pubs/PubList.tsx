import React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { DiscoveredPub } from '@/types';
import PubListItem from './PubListItem';

type PubListProps = {
    isLoading: boolean;
    pubs: DiscoveredPub[];
};

export default function PubList({ pubs, isLoading }: PubListProps) {
    return (
        <View>
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <FlatList
                    horizontal={true}
                    data={pubs}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <PubListItem pub={item} />}
                />
            )}
        </View>
    );
}
