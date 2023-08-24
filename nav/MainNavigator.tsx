import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from '@/nav/BottomTabNavigator';
import React from 'react';
import PubHome from '@/screens/PubView/PubHome';
import { PubSchema, UserReviewType } from '@/types';

export type MainNavigatorStackParamList = {
    Home: undefined;
    PubView: { pub: PubSchema };
    ViewReview: {
        review: UserReviewType;
        onDelete: () => void;
        onEdit: (review: UserReviewType) => void;
    };
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
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
