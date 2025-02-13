import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from '@/nav/BottomTabNavigator';
import React from 'react';
import PubView from '@/screens/MainNavigator/PubView';
import Suggestions from '@/screens/MainNavigator/Suggestions';
import CreateReview from '@/screens/MainNavigator/CreateReview';
import ViewReview from '@/screens/MainNavigator/ViewReview';
import { Tables } from '@/types/schema';
import CreateComment from '@/screens/MainNavigator/CreateComment';
import AddToList from '@/screens/MainNavigator/AddToList';
import Profile from '@/screens/MainNavigator/Profile';
import UserCollections from '@/screens/MainNavigator/UserCollections';
import UserCollectionView from '@/screens/MainNavigator/UserCollectionView';
import FollowersFollowingView from '@/screens/MainNavigator/FollowersFollowingView';
import Settings from '@/screens/MainNavigator/Settings';
import { UserType } from '@/services/queries/user';
import SelectPub from '@/screens/MainNavigator/SelectPub';
import UserActivity from '@/screens/MainNavigator/UserActivity';
import { FetchPubType } from '@/services/queries/pub';
import CreateCollection from '@/screens/MainNavigator/CreateCollection';

export type MainNavigatorStackParamList = {
    Home: undefined;
    PubView: {
        pubId: number;
        onSaveToggle?: (id: number, value: boolean) => void;
    };
    Suggestions: { pub: FetchPubType };
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
    Settings: {
        username: string;
        name: string;
        email: string;
        location: string;
        bio: string;
        profile_photo: string;
        favourites: UserType['favourites'];
    };
    SelectPub: {
        header: string;
        excludedIds: number[];
        onAdd: (pub: {
            id: number;
            name: string;
            primary_photo: string | null;
        }) => void;
    };
    UserActivity: {
        userId: string;
    };
    CreateCollection: undefined;
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
            <Stack.Screen
                name="SelectPub"
                component={SelectPub}
                options={{ headerShown: false, presentation: 'modal' }}
            />
            <Stack.Screen
                name="UserActivity"
                component={UserActivity}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CreateCollection"
                component={CreateCollection}
                options={{ headerShown: false, presentation: 'modal' }}
            />
        </Stack.Navigator>
    );
}
