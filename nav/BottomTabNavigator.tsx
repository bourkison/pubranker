import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Saved from '@/screens/Saved';
import { Ionicons } from '@expo/vector-icons';
import { requestBackgroundPermissionsAsync } from 'expo-location';
import Profile from '@/screens/Profile';
import Explore from '@/screens/Explore';
import { SECONDARY_COLOR } from '@/constants';

export type BottomTabNavigatorParamList = {
    Explore: undefined;
    Saved: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: SECONDARY_COLOR,
                tabBarStyle: {
                    backgroundColor: '#fff',
                },
            }}>
            <Tab.Screen
                name="Explore"
                component={Explore}
                options={{
                    tabBarIcon: ({ size, focused }) => (
                        <Ionicons
                            name={focused ? 'search' : 'search-outline'}
                            size={size}
                            color={focused ? SECONDARY_COLOR : undefined}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Saved"
                component={Saved}
                options={{
                    tabBarIcon: ({ size, focused }) => (
                        <Ionicons
                            name={focused ? 'heart' : 'heart-outline'}
                            size={size}
                            color={focused ? SECONDARY_COLOR : undefined}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ size, focused }) => (
                        <Ionicons
                            name={focused ? 'person' : 'person-outline'}
                            size={size}
                            color={focused ? SECONDARY_COLOR : undefined}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
requestBackgroundPermissionsAsync();
