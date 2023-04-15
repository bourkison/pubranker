import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import Discover from '@/screens/BottomSheet/Discover';
import PubHome from '@/screens/BottomSheet/PubView/PubHome';
import { DiscoveredPub, NearbyPub } from '@/types';
import CreateReview from '@/screens/BottomSheet/PubView/CreateReview';
import ViewReview from '@/screens/BottomSheet/PubView/ViewReview';
import EditReview from '@/screens/BottomSheet/PubView/EditReview';
import { TReview } from '@/components/Pubs/Review';

export type SelectedPub = DiscoveredPub | NearbyPub;

export type BottomSheetStackParamList = {
    Discover: undefined;
    PubHome: { pub: SelectedPub };
    CreateReview: { pub: SelectedPub };
    ViewReview: { pub: SelectedPub; review: TReview };
    EditReview: { pub: SelectedPub; review: TReview };
};

const Stack = createStackNavigator<BottomSheetStackParamList>();

export default function BottomSheetNavigator({}) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: 'white' },
            }}>
            <Stack.Screen name="Discover" component={Discover} />
            <Stack.Screen name="PubHome" component={PubHome} />
            <Stack.Screen name="CreateReview" component={CreateReview} />
            <Stack.Screen name="ViewReview" component={ViewReview} />
            <Stack.Screen name="EditReview" component={EditReview} />
        </Stack.Navigator>
    );
}
