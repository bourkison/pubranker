import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '@/screens/Home';
import Saved from '@/screens/Saved';
import { Ionicons } from '@expo/vector-icons';
import { requestBackgroundPermissionsAsync } from 'expo-location';
import Settings from '@/screens/Settings';
import { supabase } from '@/services/supabase';
import { useAppDispatch } from '@/store/hooks';
import { fetchUser, logout } from '@/store/slices/user';

const Tab = createBottomTabNavigator();

export default function Navigator() {
    const dispatch = useAppDispatch();

    supabase.auth.onAuthStateChange((event, session) => {
        console.log(event, session);

        if (event === 'SIGNED_IN' && session) {
            dispatch(fetchUser(session));
        } else if (event === 'SIGNED_OUT') {
            dispatch(logout());
        }
    });

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
                            name={focused ? 'home' : 'home-outline'}
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
                            name={focused ? 'heart' : 'heart-outline'}
                            size={size}
                            color={focused ? 'rgb(229, 130, 68)' : undefined}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
                options={{
                    tabBarIcon: ({ size, focused }) => (
                        <Ionicons
                            name={focused ? 'cog' : 'cog-outline'}
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
