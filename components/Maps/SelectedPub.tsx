import { PubSchema } from '@/types';
import React from 'react';
import { View, Text } from 'react-native';

type SelectedPubProps = {
    pub: PubSchema;
};

export default function SelectedPub({ pub }: SelectedPubProps) {
    return (
        <View>
            <Text>{pub.name}</Text>
        </View>
    );
}
