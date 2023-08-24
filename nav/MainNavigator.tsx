import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from '@/nav/BottomTabNavigator';
import React from 'react';
import PubView from '@/screens/PubView';
import { PubSchema } from '@/types';

export type MainNavigatorStackParamList = {
    Home: undefined;
    PubView: { pub: PubSchema };
};

const Stack = createStackNavigator<MainNavigatorStackParamList>();

export default function MainNavigator() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PubView"
                component={PubView}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
