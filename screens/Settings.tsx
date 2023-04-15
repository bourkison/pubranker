import { signOut as storeSignOut } from '@/store/slices/user';
import { useAppDispatch } from '@/store/hooks';
import React from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';

export default function Settings() {
    const dispatch = useAppDispatch();

    return (
        <SafeAreaView>
            <Text>Settings</Text>
            <View>
                <TouchableOpacity onPress={() => dispatch(storeSignOut())}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
