import { signOut as storeSignOut } from '@/store/slices/user';
import { useAppDispatch } from '@/store/hooks';
import React from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';

export default function Profile() {
    const dispatch = useAppDispatch();

    return (
        <SafeAreaView>
            <Text>Profile</Text>
            <View>
                <TouchableOpacity onPress={() => dispatch(storeSignOut())}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
