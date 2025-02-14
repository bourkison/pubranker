import Header from '@/components/Utility/Header';
import { ProfileNavigatorScreenProps } from '@/types/nav';
import React from 'react';
import { SafeAreaView, Text } from 'react-native';

export default function Notifications({}: ProfileNavigatorScreenProps<'Notifications'>) {
    return (
        <SafeAreaView>
            <Header header="Notifications" />
            <Text>Notifications</Text>
        </SafeAreaView>
    );
}
