import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoggedInProfile from '@/screens/ProfileNavigator/LoggedInProfile';
import Notifications from '@/screens/ProfileNavigator/Notifications';
import { ProfileNavigatorStackParamList } from '@/types/nav';

const Stack = createStackNavigator<ProfileNavigatorStackParamList>();

export default function ProfileNavigator() {
    return (
        <Stack.Navigator initialRouteName="ProfileHome">
            <Stack.Screen
                name="ProfileHome"
                component={LoggedInProfile}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Notifications"
                component={Notifications}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
