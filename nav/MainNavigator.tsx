import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from '@/nav/BottomTabNavigator';
import React from 'react';
import PubView from '@/screens/PubView';
import Suggestions from '@/screens/Suggestions';
import { PubSchema } from '@/types';
import CreateReview from '@/screens/CreateReview';
import ViewReview from '@/screens/ViewReview';
import { Database } from '@/types/schema';
import CreateComment from '@/screens/CreateComment';

export type MainNavigatorStackParamList = {
    Home: undefined;
    PubView: {
        pubId: number;
        onSaveToggle?: (id: number, value: boolean) => void;
    };
    Suggestions: { pub: PubSchema };
    CreateReview: {
        pubId: number;
    };
    ViewReview: {
        reviewId: number;
    };
    CreateComment: {
        reviewId: number;
        onCreate: (
            comment: Database['public']['Tables']['comments']['Row'],
        ) => void;
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
                component={PubView}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Suggestions"
                component={Suggestions}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CreateReview"
                component={CreateReview}
                options={{ headerShown: false, presentation: 'modal' }}
            />
            <Stack.Screen
                name="ViewReview"
                component={ViewReview}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CreateComment"
                component={CreateComment}
                options={{ headerShown: false, presentation: 'modal' }}
            />
        </Stack.Navigator>
    );
}
