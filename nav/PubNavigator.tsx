import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PubNavigatorStackParamList } from '@/types/nav';
import PubView from '@/screens/PubNavigator/PubView';
import PubReviewsView from '@/screens/PubNavigator/PubReviewsView';

const Stack = createStackNavigator<PubNavigatorStackParamList>();

export default function PubNavigator() {
    return (
        <Stack.Navigator initialRouteName="PubView">
            <Stack.Screen
                name="PubView"
                component={PubView}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PubReviewsView"
                component={PubReviewsView}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
