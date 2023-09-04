import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Suggestions({
    route,
    navigation,
}: StackScreenProps<MainNavigatorStackParamList, 'Suggestions'>) {
    return (
        <View>
            <Text>Suggestions {route.params.pub.name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
