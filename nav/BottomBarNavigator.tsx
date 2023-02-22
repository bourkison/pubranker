import React from 'react';
import Discover from '@/screens/BottomBar/Discover';
import PubView from '@/screens/BottomBar/PubView';
import { useAppSelector } from '@/store/hooks';
import { View, Text } from 'react-native';

export default function BottomBarNavigator() {
    // TODO: Convert to Stack Navigator.

    const bottomBarType = useAppSelector(state => state.pub.bottomBarType);
    const selectedPub = useAppSelector(state => state.pub.selectedPub);

    if (
        bottomBarType === 'discover' ||
        (bottomBarType === 'selected' && !selectedPub)
    ) {
        return <Discover />;
    }

    if (bottomBarType === 'selected' && selectedPub) {
        return <PubView pub={selectedPub} />;
    }

    return (
        <View>
            <Text>Content</Text>
        </View>
    );
}
