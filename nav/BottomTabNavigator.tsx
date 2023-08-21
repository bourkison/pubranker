import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Saved from '@/screens/Saved';
import { Ionicons } from '@expo/vector-icons';
import { requestBackgroundPermissionsAsync } from 'expo-location';
import Settings from '@/screens/Settings';
import Explore from '@/screens/Explore';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <BottomSheetModalProvider>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: '#721121',
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
                                color={focused ? '#721121' : undefined}
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
                                color={focused ? '#721121' : undefined}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={Settings}
                    options={{
                        tabBarIcon: ({ size, focused }) => (
                            <Ionicons
                                name={focused ? 'person' : 'person-outline'}
                                size={size}
                                color={focused ? '#721121' : undefined}
                            />
                        ),
                    }}
                />
            </Tab.Navigator>
        </BottomSheetModalProvider>
    );
}
requestBackgroundPermissionsAsync();
