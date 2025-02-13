import { CollectionType } from '@/services/queries/collections';
import React from 'react';
import { View, Text } from 'react-native';

type CollectionItemListItemProps = {
    collectionItem: CollectionType['collection_items'];
};

export default function CollectionItemListItem({}: CollectionItemListItemProps) {
    return (
        <View>
            <Text>Test</Text>
        </View>
    );
}
