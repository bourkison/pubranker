import { ProfileNavigatorScreenProps } from '@/types/nav';
import React from 'react';
import { View, Text } from 'react-native';

export default function Notifications({}: ProfileNavigatorScreenProps<'Notifications'>) {
    return (
        <View>
            <Text>Notifications</Text>
        </View>
    );
}
