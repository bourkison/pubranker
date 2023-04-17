import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { SelectedPub } from '@/store/slices/pub';

import Discover from '@/screens/BottomSheet/Discover';
import PubHome from '@/screens/BottomSheet/PubView/PubHome';
import CreateReview from '@/screens/BottomSheet/PubView/CreateReview';
import ViewReview from '@/screens/BottomSheet/PubView/ViewReview';
import EditReview from '@/screens/BottomSheet/PubView/EditReview';
import { TReview } from '@/components/Pubs/Review';
import OpeningHours from '@/screens/BottomSheet/PubView/OpeningHours';
import PubHomeHeader from './Headers/PubHomeHeader';
import ViewReviewHeader from './Headers/ViewReviewHeader';

export type BottomSheetStackParamList = {
    Discover: undefined;
    PubHome: { pubId: number };
    CreateReview: { pub: SelectedPub };
    ViewReview: { pub: SelectedPub; review: TReview };
    EditReview: { pub: SelectedPub; review: TReview };
    OpeningHours: { pub: SelectedPub };
};

const Stack = createStackNavigator<BottomSheetStackParamList>();

export default function BottomSheetNavigator({}) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: 'white' },
                gestureEnabled: true,
                gestureResponseDistance: 100,
            }}>
            <Stack.Screen name="Discover" component={Discover} />
            <Stack.Screen
                name="PubHome"
                component={PubHome}
                options={{
                    headerShown: true,
                    header: props => <PubHomeHeader {...props} />,
                }}
            />
            <Stack.Screen name="CreateReview" component={CreateReview} />
            <Stack.Screen
                name="ViewReview"
                component={ViewReview}
                options={{
                    headerShown: true,
                    title: 'Review',
                    header: props => <ViewReviewHeader {...props} />,
                }}
            />
            <Stack.Screen
                name="EditReview"
                component={EditReview}
                options={{
                    headerShown: true,
                    title: 'Edit Your Review',
                    header: props => <ViewReviewHeader {...props} />,
                }}
            />
            <Stack.Screen name="OpeningHours" component={OpeningHours} />
        </Stack.Navigator>
    );
}
