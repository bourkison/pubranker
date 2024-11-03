import { SavedNavigatorStackParamList } from '@/nav/SavedNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, Text } from 'react-native';

export default function CollectionsView({}: StackScreenProps<
    SavedNavigatorStackParamList,
    'CollectionsView'
>) {
    return (
        <SafeAreaView>
            <Text>Test</Text>
        </SafeAreaView>
    );
}
