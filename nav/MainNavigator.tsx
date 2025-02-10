import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from '@/nav/BottomTabNavigator';
import React from 'react';
import PubView from '@/screens/MainNavigator/PubView';
import Suggestions from '@/screens/MainNavigator/Suggestions';
import { PubSchema } from '@/types';
import CreateReview from '@/screens/MainNavigator/CreateReview';
import ViewReview from '@/screens/MainNavigator/ViewReview';
import { Tables } from '@/types/schema';
import CreateComment from '@/screens/MainNavigator/CreateComment';
import AddToList from '@/screens/MainNavigator/AddToList';
import Profile from '@/screens/MainNavigator/Profile';
import UserCollections from '@/screens/MainNavigator/UserCollections';
import UserCollectionView from '@/screens/MainNavigator/UserCollectionView';
import FollowersFollowingView from '@/screens/MainNavigator/FollowersFollowingView';
import Settings from '@/screens/ProfileNavigator/Settings';

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
        onCreate: (comment: Tables<'comments'>) => void;
    };
    AddToList: {
        pubId: number;
    };
    Profile: {
        userId: string;
    };
    UserCollections: {
        userId: string;
    };
    UserCollectionView: {
        collectionId: number;
    };
    FollowersFollowingView: {
        userId: string;
        type: 'followers' | 'following';
        count: number;
    };
    Settings: undefined;
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
            <Stack.Screen
                name="AddToList"
                component={AddToList}
                options={{ headerShown: false, presentation: 'modal' }}
            />
            <Stack.Screen
                name="Profile"
                component={Profile}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="UserCollections"
                component={UserCollections}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="UserCollectionView"
                component={UserCollectionView}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="FollowersFollowingView"
                component={FollowersFollowingView}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Settings"
                component={Settings}
                options={{ headerShown: false, presentation: 'modal' }}
            />
        </Stack.Navigator>
    );
}
