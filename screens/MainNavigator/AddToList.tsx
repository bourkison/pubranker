import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { View, Text } from 'react-native';

export default function AddToList({}: StackScreenProps<
    MainNavigatorStackParamList,
    'AddToList'
>) {
    return (
        <View>
            <Text>Add to list</Text>
        </View>
    );
}
