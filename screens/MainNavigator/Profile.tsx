import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import ProfileView from '@/components/User/ProfileView';
import { userQuery, UserType } from '@/services/queries/user';
import { supabase } from '@/services/supabase';

export default function Profile({
    route,
    navigation,
}: StackScreenProps<MainNavigatorStackParamList, 'Profile'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<UserType>();
    const [isLoggedInUser, setIsLoggedInUser] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);
    const [isFollowingUs, setIsFollowingUs] = useState(false);

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

                const weFollowUserPromise = () =>
                    new Promise<void>(async resolve => {
                        const { count } = await supabase
                            .from('follows')
                            .select('count', { count: 'exact' })
                            .eq('created_by', userData.user.id)
                            .eq('user_id', route.params.userId)
                            .limit(1);

                        if (count === 1) {
                            setIsFollowed(true);
                        } else {
                            setIsFollowed(false);
                        }

                        resolve();
                    });

                const userFollowsUsPromise = () =>
                    new Promise<void>(async resolve => {
                        const { count } = await supabase
                            .from('follows')
                            .select('count', { count: 'exact' })
                            .eq('user_id', userData.user.id)
                            .eq('created_by', route.params.userId)
                            .limit(1);

                        if (count === 1) {
                            setIsFollowingUs(true);
                        } else {
                            setIsFollowingUs(false);
                        }

                        resolve();
                    });

                await Promise.allSettled([
                    weFollowUserPromise(),
                    userFollowsUsPromise(),
                ]);
            }

            setIsLoading(false);

            if (error) {
                console.error(error);
                return;
            }

            setUser(data);
        })();
    }, [route]);

    const toggleFollow = useCallback(
        (follow: boolean) => {
            if (!user) {
                return;
            }

            if (follow) {
                setIsFollowed(true);
                setUser({
                    ...user,
                    followers: [{ count: user.followers[0].count + 1 }],
                });

                return;
            }

            if (!follow) {
                setIsFollowed(false);
                setUser({
                    ...user,
                    followers: [{ count: user.followers[0].count - 1 }],
                });
            }
        },
        [user],
    );

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
                <TouchableOpacity
                    style={styles.settingsContainer}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={14} />
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>{user.username}</Text>
                </View>

                <TouchableOpacity style={styles.menuContainer}>
                    <SimpleLineIcons name="options" size={14} />
                </TouchableOpacity>
            </View>

            <ProfileView
                user={user}
                isLoggedInUser={isLoggedInUser}
                isFollowed={isFollowed}
                setIsFollowed={toggleFollow}
                isFollowingUs={isFollowingUs}
            />
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
