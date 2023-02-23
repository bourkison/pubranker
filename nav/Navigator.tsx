import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '@/screens/Home';
import Saved from '@/screens/Saved';
import { Ionicons } from '@expo/vector-icons';
import { requestBackgroundPermissionsAsync } from 'expo-location';

const Tab = createBottomTabNavigator();

export default function Navigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: 'rgb(229, 130, 68)',
                tabBarHideOnKeyboard: true,
            }}>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ size, focused }) => (
                        <Ionicons
                            name="home"
                            size={size}
                            color={focused ? 'rgb(229, 130, 68)' : undefined}
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
                            name="heart"
                            size={size}
                            color={focused ? 'rgb(229, 130, 68)' : undefined}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={Saved}
                options={{
                    tabBarIcon: ({ size, focused }) => (
                        <Ionicons
                            name="cog"
                            size={size}
                            color={focused ? 'rgb(229, 130, 68)' : undefined}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
requestBackgroundPermissionsAsync();
