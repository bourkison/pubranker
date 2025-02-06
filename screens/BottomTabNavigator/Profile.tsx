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
import UserAvatar from '@/components/User/UserAvatar';
import { Feather, SimpleLineIcons } from '@expo/vector-icons';
import ProfileTopBar from '@/components/User/ProfileTopBar';
import { userQuery } from '@/services/queries/user';
import { UserType } from '@/services/queries/user';
import RatingsSummary from '@/components/Ratings/RatingsSummary';

export default function Profile() {
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
                await userQuery().eq('id', data.user.id).limit(1).single();

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

            <View style={styles.avatarContainer}>
                <UserAvatar
                    photo={user.profile_photo ?? ''}
                    size={64}
                    withShadow={true}
                />
            </View>

            <ProfileTopBar userId={user.id} />

            <View style={styles.ratingsContainer}>
                <RatingsSummary
                    header="Ratings"
                    ratingsHeight={100}
                    ratingsPadding={10}
                    ratings={[
                        user.review_ones[0].count,
                        user.review_twos[0].count,
                        user.review_threes[0].count,
                        user.review_fours[0].count,
                        user.review_fives[0].count,
                        user.review_sixes[0].count,
                        user.review_sevens[0].count,
                        user.review_eights[0].count,
                        user.review_nines[0].count,
                        user.review_tens[0].count,
                    ]}
                />
            </View>

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
    ratingsContainer: {},
});
