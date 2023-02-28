import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '@/screens/BottomSheet/PubView/Home';
import CreateReview from '@/screens/BottomSheet/PubView/CreateReview';
import { useAppSelector } from '@/store/hooks';
import { View, Text } from 'react-native';
import { useBottomSheet } from '@gorhom/bottom-sheet';

const Stack = createStackNavigator();

const PubViewNavigator = () => {
    const selectedPub = useAppSelector(state => state.pub.selectedPub);

    if (!selectedPub) {
        return (
            <View>
                <Text>No Pub Selected.</Text>
            </View>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{ cardStyle: { backgroundColor: 'white' } }}>
            <Stack.Screen
                name="PubViewHome"
                component={Home}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="Review" component={CreateReview} />
        </Stack.Navigator>
    );
};

export default function PubViewNavigatorContainer() {
    const selectedPub = useAppSelector(state => state.pub.selectedPub);
    const { animatedIndex, close, snapToIndex } = useBottomSheet();
    const bottomBarType = useAppSelector(state => state.pub.bottomBarType);

    // TODO: This logic should be held here and not in PubViewHome, but things break there.
    useEffect(() => {
        if (
            bottomBarType === 'selected' &&
            selectedPub &&
            animatedIndex.value === -1
        ) {
            snapToIndex(0);
        } else if (bottomBarType === 'discover' && animatedIndex.value !== -1) {
            close();
        }
    }, [bottomBarType, snapToIndex, animatedIndex, close, selectedPub]);

    return (
        <View style={{ flex: 1 }}>
            <PubViewNavigator />
        </View>
    );
}
