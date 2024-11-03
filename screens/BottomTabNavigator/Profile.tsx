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
import PubMapMarker from '@/components/Maps/PubMapMarker';
import { SECONDARY_COLOR } from '@/constants';
import { supabase } from '@/services/supabase';
import { Database } from '@/types/schema';
import UserAvatar from '@/components/User/UserAvatar';
import { Feather, SimpleLineIcons } from '@expo/vector-icons';
import ProfileTopBar from '@/components/User/ProfileTopBar';

export default function Profile() {
    const [user, setUser] =
        useState<Database['public']['Tables']['users_public']['Row']>();
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

            const { data: publicUser, error: publicUserError } = await supabase
                .from('users_public')
                .select()
                .eq('id', data.user.id)
                .limit(1)
                .single();

            if (publicUserError) {
                console.warn('no public user', publicUserError);
                setIsLoading(false);
                return;
            }

            setUser(publicUser);
            setIsLoading(false);
            console.log(publicUser);
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

            <View style={styles.avatarContainer}>
                <UserAvatar
                    photo={user.profile_photo ?? ''}
                    size={64}
                    withShadow={true}
                />
            </View>

            <ProfileTopBar userId={user.id} />

            <Text>Check ins, reviews etc</Text>
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
    avatarTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        paddingVertical: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
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
