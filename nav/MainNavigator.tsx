import { SelectedPub } from '@/store/slices/pub';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from '@/nav/BottomTabNavigator';
import React from 'react';
import PubHome from '@/screens/PubHome_v2';
import PubHomeHeader from '@/nav/Headers/PubHomeHeader';

export type MainNavigatorStackParamList = {
    Home: undefined;
    PubView: { pub: SelectedPub };
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
                component={PubHome}
                options={{ header: PubHomeHeader, headerShown: true }}
            />
        </Stack.Navigator>
    );
}
