import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { supabase } from '@/services/supabase';
import { Feather } from '@expo/vector-icons';
import { userQuery } from '@/services/queries/user';
import { UserType } from '@/services/queries/user';
import ProfileView from '@/components/User/ProfileView';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';

export default function LoggedInProfile() {
    const [user, setUser] = useState<UserType>();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigation =
        useNavigation<StackNavigationProp<MainNavigatorStackParamList>>();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const { data, error } = await supabase.auth.getUser();

            if (error) {
                console.warn(error);
                setIsLoading(false);
                return;
            }

            setEmail(data.user.email || '');

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
        <SafeAreaView style={styles.flexOne}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.settingsContainer}
                    onPress={() =>
                        navigation.navigate('Settings', { user, email })
                    }>
                    <Feather name="settings" size={14} />
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>{user.username}</Text>
                </View>

                <TouchableOpacity style={styles.menuContainer}>
                    <Feather name="bell" size={15} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.flexOne}>
                <ProfileView
                    user={user}
                    isLoggedInUser={true}
                    isFollowed={true}
                    setIsFollowed={() => console.warn("This shouldn't happen.")}
                    isFollowingUs={true}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const ICON_PADDING = 10;

const styles = StyleSheet.create({
    flexOne: { flex: 1 },
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
