import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Saved from '@/screens/SavedNavigator/Saved';
import CollectionsHome from '@/screens/SavedNavigator/CollectionsHome';
import CollectionsView from '@/screens/SavedNavigator/CollectionsView';

export type SavedNavigatorStackParamList = {
    SavedHome: undefined;
    CollectionsHome: undefined;
    CollectionsView: {
        collectionId: number;
    };
};

const Stack = createStackNavigator<SavedNavigatorStackParamList>();

export default function SavedNavigator() {
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
                name="CollectionsView"
                component={CollectionsView}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
