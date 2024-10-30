import { signOut as storeSignOut } from '@/store/slices/user';
import { useAppDispatch } from '@/store/hooks';
import React from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import PubMapMarker from '@/components/Maps/PubMapMarker';
import { SECONDARY_COLOR } from '@/constants';

export default function Profile() {
    const dispatch = useAppDispatch();

    return (
        <SafeAreaView>
            <Text>Profile</Text>
            <PubMapMarker
                width={48}
                pinColor={SECONDARY_COLOR}
                outlineColor="#FFF"
                dotColor="#FFF"
            />
            <View>
                <TouchableOpacity onPress={() => dispatch(storeSignOut())}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
