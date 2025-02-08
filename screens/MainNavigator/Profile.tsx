import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { Feather, SimpleLineIcons } from '@expo/vector-icons';
import ProfileView from '@/components/User/ProfileView';
import { userQuery, UserType } from '@/services/queries/user';
import { supabase } from '@/services/supabase';

export default function Profile({
    route,
}: StackScreenProps<MainNavigatorStackParamList, 'Profile'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<UserType>();
    const [isLoggedInUser, setIsLoggedInUser] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const { data, error } = await userQuery(route.params.userId);

            // Check to see if this profile is the logged in user.
            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                console.warn(userError);
            } else {
                setIsLoggedInUser(userData.user.id === route.params.userId);
            }

            setIsLoading(false);

            if (error) {
                console.error(error);
                return;
            }

            setUser(data);
        })();
    }, [route]);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (!user) {
        return (
            <View>
                <Text>404 User Not Found</Text>
            </View>
        );
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

            <ProfileView user={user} />
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
