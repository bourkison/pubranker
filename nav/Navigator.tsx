import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '@/screens/Home';
import Saved from '@/screens/Saved';

const Tab = createBottomTabNavigator();

export default function Navigator() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Saved" component={Saved} />
            <Tab.Screen name="Discover" component={Saved} />
        </Tab.Navigator>
    );
}
