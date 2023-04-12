import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import Discover from '@/screens/BottomSheet/Discover';
import PubView from '@/screens/BottomSheet/PubView/Home';

export type BottomSheetStackParamList = {
    Discover: undefined;
    PubView: undefined;
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
            <Stack.Screen name="PubView" component={PubView} />
        </Stack.Navigator>
    );
}
