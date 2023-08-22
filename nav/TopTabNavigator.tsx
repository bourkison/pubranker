import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PubReviews from '@/screens/PubRPI/PubReviews';
import { PubRPIContext } from './context/context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MainNavigatorStackParamList } from './MainNavigator';
import PubImages from '@/screens/PubRPI/PubImages';
import PubDetails from '@/components/Pubs/PubView/PubDetails';

export type TopTabNavigatorParamList = {
    PubReviews: undefined;
    PubPhotos: undefined;
    PubInfo: undefined;
};

const Tab = createMaterialTopTabNavigator<TopTabNavigatorParamList>();

export default function TopTabNavigator() {
    const route = useRoute<RouteProp<MainNavigatorStackParamList, 'PubView'>>();

    return (
        <PubRPIContext.Provider value={{ pub: route.params.pub }}>
            <Tab.Navigator
                initialRouteName="PubReviews"
                screenOptions={{
                    tabBarScrollEnabled: true,
                    swipeEnabled: false,
                    tabBarLabelStyle: {
                        textTransform: 'none',
                        fontSize: 14,
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: '#384D48',
                    },
                }}>
                <Tab.Screen
                    name="PubReviews"
                    options={{ tabBarLabel: 'Reviews' }}
                    component={PubReviews}
                />
                <Tab.Screen
                    name="PubPhotos"
                    options={{ tabBarLabel: 'Photos' }}
                    component={PubImages}
                />
                <Tab.Screen
                    name="PubInfo"
                    options={{ tabBarLabel: 'Additional Information' }}
                    component={PubDetails}
                />
            </Tab.Navigator>
        </PubRPIContext.Provider>
    );
}
