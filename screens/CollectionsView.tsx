import { SavedNavigatorStackParamList } from '@/nav/SavedNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { View, Text } from 'react-native';

export default function CollectionsView({}: StackScreenProps<
    SavedNavigatorStackParamList,
    'CollectionsView'
>) {
    return (
        <View>
            <Text>Test</Text>
        </View>
    );
}
