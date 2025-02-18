import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from 'react';
import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    RefreshControl,
} from 'react-native';
import { supabase } from '@/services/supabase';
import { Feather } from '@expo/vector-icons';
import { userQuery } from '@/services/queries/user';
import { UserType } from '@/services/queries/user';
import ProfileView from '@/components/User/ProfileView';
import { ProfileNavigatorScreenProps } from '@/types/nav';
import Header from '@/components/Utility/Header';
import { HEADER_ICON_SIZE } from '@/constants';

export default function LoggedInProfile({
    navigation,
}: ProfileNavigatorScreenProps<'ProfileHome'>) {
    const [user, setUser] = useState<UserType>();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = useCallback(
        async (setLoading: Dispatch<SetStateAction<boolean>>) => {
            setLoading(true);

            const { data, error } = await supabase.auth.getUser();

            if (error) {
                console.warn(error);
                setLoading(false);
                return;
            }

            setEmail(data.user.email || '');

            const { data: publicUser, error: publicUserError } =
                await userQuery(data.user.id);

            if (publicUserError) {
                console.warn('no public user', publicUserError);
                setLoading(false);
                return;
            }

            setUser(publicUser);
            setLoading(false);
        },
        [],
    );

    useEffect(() => {
        fetchData(setIsLoading);
    }, [fetchData]);

    const refresh = useCallback(() => fetchData(setIsRefreshing), [fetchData]);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (!user) {
        return <Text>Sign Up to get Started</Text>;
    }

    return (
        <SafeAreaView style={styles.flexOne}>
            <Header
                header={user.username}
                leftColumn={
                    <TouchableOpacity
                        style={styles.settingsContainer}
                        onPress={() =>
                            navigation.navigate('Settings', {
                                email,
                                name: user.name,
                                username: user.username,
                                bio: user.bio,
                                profile_photo: user.profile_photo,
                                favourites: user.favourites,
                                location: user.location,
                            })
                        }>
                        <Feather name="settings" size={HEADER_ICON_SIZE} />
                    </TouchableOpacity>
                }
                rightColumn={
                    <TouchableOpacity
                        style={styles.menuContainer}
                        onPress={() => navigation.navigate('Notifications')}>
                        <Feather name="bell" size={HEADER_ICON_SIZE} />
                    </TouchableOpacity>
                }
            />

            <ScrollView
                style={styles.flexOne}
                refreshControl={
                    <RefreshControl
                        onRefresh={refresh}
                        refreshing={isRefreshing}
                    />
                }>
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
    settingsContainer: {
        paddingLeft: ICON_PADDING,
    },
    menuContainer: {
        paddingRight: ICON_PADDING,
    },
});
