import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, Ionicons } from '@expo/vector-icons';
import { requestBackgroundPermissionsAsync } from 'expo-location';
import Profile from '@/screens/BottomTabNavigator/Profile';
import Explore from '@/screens/BottomTabNavigator/Explore';
import { SECONDARY_COLOR } from '@/constants';
import Feed from '@/screens/BottomTabNavigator/Feed';
import SavedNavigator from '@/nav/SavedNavigator';
import { useSharedCollectionContext } from '@/context/collectionContext';
import { StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorStackParamList } from './MainNavigator';
import { useFocusEffect } from '@react-navigation/native';

export type BottomTabNavigatorParamList = {
    Explore: undefined;
    Favourites: undefined;
    Profile: undefined;
    Feed: undefined;
};

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

export default function BottomTabNavigator({
    navigation,
}: StackScreenProps<MainNavigatorStackParamList, 'Home'>) {
    const { setIsOnBottomTabsPage, setNavigation } =
        useSharedCollectionContext();

    useEffect(() => setNavigation(navigation), [navigation, setNavigation]);

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
