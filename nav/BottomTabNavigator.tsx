import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, Ionicons } from '@expo/vector-icons';
import { requestBackgroundPermissionsAsync } from 'expo-location';
import Explore from '@/screens/BottomTabNavigator/Explore';
import { SECONDARY_COLOR } from '@/constants';
import Feed from '@/screens/BottomTabNavigator/Feed';
import SavedNavigator from '@/nav/SavedNavigator';
import { useSharedCollectionContext } from '@/context/collectionContext';
import { useFocusEffect } from '@react-navigation/native';
import ProfileNavigator from '@/nav/ProfileNavigator';
import {
    HomeNavigatorBottomTabParamList,
    RootStackScreenProps,
} from '@/types/nav';

const Tab = createBottomTabNavigator<HomeNavigatorBottomTabParamList>();

export default function BottomTabNavigator({}: RootStackScreenProps<'Home'>) {
    const { setIsOnBottomTabsPage } = useSharedCollectionContext();

    useFocusEffect(() => {
        setIsOnBottomTabsPage(true);

        return () => setIsOnBottomTabsPage(false);
    });

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: SECONDARY_COLOR,
                tabBarStyle: {
                    backgroundColor: '#fff',
                },
                tabBarShowLabel: false,
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
                name="Favourites"
                component={SavedNavigator}
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
                name="Feed"
                component={Feed}
                options={{
                    tabBarIcon: ({ size, focused }) => (
                        <Feather
                            name="menu"
                            size={size}
                            color={focused ? SECONDARY_COLOR : undefined}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="LoggedInProfile"
                component={ProfileNavigator}
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
