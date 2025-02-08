import { signOut as storeSignOut } from '@/store/slices/user';
import { useAppDispatch } from '@/store/hooks';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { supabase } from '@/services/supabase';
import { Feather, SimpleLineIcons } from '@expo/vector-icons';
import { userQuery } from '@/services/queries/user';
import { UserType } from '@/services/queries/user';
import ProfileView from '@/components/User/ProfileView';

export default function LoggedInProfile() {
    const [user, setUser] = useState<UserType>();
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const { data, error } = await supabase.auth.getUser();

            if (error) {
                console.warn(error);
                setIsLoading(false);
                return;
            }

            const { data: publicUser, error: publicUserError } =
                await userQuery(data.user.id);

            if (publicUserError) {
                console.warn('no public user', publicUserError);
                setIsLoading(false);
                return;
            }

            setUser(publicUser);
            setIsLoading(false);
            console.log('user', publicUser);
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (!user) {
        return <Text>Sign Up to get Started</Text>;
    }

    return (
        <SafeAreaView>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.settingsContainer}>
                    <Feather name="settings" size={14} />
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>{user.username}</Text>
                </View>

                <TouchableOpacity style={styles.menuContainer}>
                    <SimpleLineIcons name="options" size={14} />
                </TouchableOpacity>
            </View>

            <ProfileView user={user} isLoggedInUser={true} />

            <View>
                <TouchableOpacity onPress={() => dispatch(storeSignOut())}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const ICON_PADDING = 10;

const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    settingsContainer: {
        paddingLeft: ICON_PADDING,
    },
    menuContainer: {
        paddingRight: ICON_PADDING,
    },

    headerTextContainer: {
        flex: 1,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Jost',
        textAlign: 'center',
    },
});
