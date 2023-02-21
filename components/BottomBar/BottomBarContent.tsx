import { useAppSelector } from '@/store/hooks';
import React from 'react';
import { View, Text } from 'react-native';
import BottomBarDiscover from '@/components/BottomBar/BottomBarDiscover';
import BottomBarPubView from '@/components/BottomBar/BottomBarPubView';

export default function BottomBarContent() {
    const bottomBarType = useAppSelector(state => state.pub.bottomBarType);
    const selectedPub = useAppSelector(state => state.pub.selectedPub);

    if (
        bottomBarType === 'discover' ||
        (bottomBarType === 'selected' && !selectedPub)
    ) {
        return <BottomBarDiscover />;
    }

    if (bottomBarType === 'selected' && selectedPub) {
        return <BottomBarPubView pub={selectedPub} />;
    }

    return (
        <View>
            <Text>Content</Text>
        </View>
    );
}
