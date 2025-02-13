import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Saved from '@/screens/SavedNavigator/Saved';
import CollectionsHome from '@/screens/SavedNavigator/CollectionsHome';
import CollectionView from '@/screens/SavedNavigator/CollectionView';
import {
    HomeNavigatorBottomTabProps,
    SavedNavigatorStackParamList,
} from '@/types/nav';

const Stack = createStackNavigator<SavedNavigatorStackParamList>();

export default function SavedNavigator({}: HomeNavigatorBottomTabProps<'Favourites'>) {
    return (
        <Stack.Navigator initialRouteName="SavedHome">
            <Stack.Screen
                name="SavedHome"
                component={Saved}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CollectionsHome"
                component={CollectionsHome}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CollectionView"
                component={CollectionView}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
