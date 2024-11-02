import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { View, Text } from 'react-native';

export default function ViewReview({
    route,
}: StackScreenProps<MainNavigatorStackParamList, 'ViewReview'>) {
    return (
        <View>
            <Text>Review View, {route.params.reviewId}</Text>
        </View>
    );
}
