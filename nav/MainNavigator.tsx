import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from '@/nav/BottomTabNavigator';
import React from 'react';
import PubView from '@/screens/MainNavigator/PubView';
import CreateReview from '@/screens/MainNavigator/CreateReview';
import ViewReview from '@/screens/MainNavigator/ViewReview';
import CreateComment from '@/screens/MainNavigator/CreateComment';
import AddToList from '@/screens/MainNavigator/AddToList';
import Profile from '@/screens/MainNavigator/Profile';
import UserCollections from '@/screens/MainNavigator/UserCollections';
import UserCollectionView from '@/screens/MainNavigator/UserCollectionView';
import FollowersFollowingView from '@/screens/MainNavigator/FollowersFollowingView';
import Settings from '@/screens/MainNavigator/Settings';
import SelectPub from '@/screens/MainNavigator/SelectPub';
import UserActivity from '@/screens/MainNavigator/UserActivity';
import CreateCollection from '@/screens/MainNavigator/CreateCollection';
import { RootStackParamList } from '@/types/nav';
import EditCollection from '@/screens/MainNavigator/EditCollection';
import UserRatings from '@/screens/MainNavigator/UserRatings';

const Stack = createStackNavigator<RootStackParamList>();

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
                name="UserRatings"
                component={UserRatings}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CreateCollection"
                component={CreateCollection}
                options={{ headerShown: false, presentation: 'modal' }}
            />
            <Stack.Screen
                name="EditCollection"
                component={EditCollection}
                options={{ headerShown: false, presentation: 'modal' }}
            />
        </Stack.Navigator>
    );
}
