import { useAppSelector } from '@/store/hooks';
import React from 'react';
import { Text, SafeAreaView } from 'react-native';
import Unauthorized from '@/screens/Unauthorized';

export default function SavedPubs() {
    const loggedIn = useAppSelector(state => state.user.loggedIn);

    if (!loggedIn) {
        return <Unauthorized type="saved" />;
    }

    return (
        <SafeAreaView>
            <Text>Saved Pubs</Text>
        </SafeAreaView>
    );
}
