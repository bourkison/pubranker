import { FollowsType } from '@/services/queries/follows';
import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native';
import UserAvatar from '@/components/User/UserAvatar';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '@/constants';
import { StackActions, useNavigation } from '@react-navigation/native';
import { supabase } from '@/services/supabase';
import { RootStackScreenProps } from '@/types/nav';

type ListFollowItemProps = {
    user: FollowsType;
    index: number;
    toggleFollow: (isFollow: boolean, index: number) => void;
};

export default function FollowListItem({
    user,
    index,
    toggleFollow,
}: ListFollowItemProps) {
    const navigation =
        useNavigation<RootStackScreenProps<'Home'>['navigation']>();

    const [isFollowing, setIsFollowing] = useState(false);

    const follow = useCallback(async () => {
        setIsFollowing(true);

        const { data, error } = await supabase.auth.getUser();

        if (error) {
            console.error(error);
            setIsFollowing(false);
            return;
        }

        const { error: followError } = await supabase
            .from('follows')
            .insert({ user_id: user.user.id, created_by: data.user.id });

        if (followError) {
            console.error('Error following user.', followError);
            setIsFollowing(false);
            return;
        }

        setIsFollowing(false);
        toggleFollow(true, index);
    }, [user, toggleFollow, index]);

    const unfollow = useCallback(async () => {
        setIsFollowing(true);

        const { data, error } = await supabase.auth.getUser();

        if (error) {
            console.error(error);
            setIsFollowing(false);
            return;
        }

        console.log('unfollowing with', user.user_id, data.user.id);

        const { error: unfollowError } = await supabase
            .from('follows')
            .delete()
            .eq('created_by', data.user.id)
            .eq('user_id', user.user.id);

        if (unfollowError) {
            console.error('Error unfollowing user.', unfollowError);
            setIsFollowing(false);
            return;
        }

        setIsFollowing(false);
        toggleFollow(false, index);
    }, [user, toggleFollow, index]);

    return (
        <TouchableHighlight
            style={styles.container}
            underlayColor="#E5E7EB"
            onPress={() => {
                const pushAction = StackActions.push('Profile', {
                    userId: user.user.id,
                });
                navigation.dispatch(pushAction);
            }}>
            <>
                <View style={styles.leftColumnContainer}>
                    <UserAvatar
                        photo={user.user.profile_photo ?? ''}
                        size={24}
                    />
                    <Text style={styles.usernameText}>
                        {user.user.username}
                    </Text>
                </View>

                {user.user.is_followed[0].count > 0 ? (
                    <TouchableOpacity
                        style={styles.rightColumnContainer}
                        onPress={unfollow}
                        disabled={isFollowing}>
                        <Ionicons
                            name="checkmark"
                            size={16}
                            color={PRIMARY_COLOR}
                        />
                        <Text style={styles.followText}>Followed</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.rightColumnContainer}
                        disabled={isFollowing}
                        onPress={follow}>
                        <FontAwesome6
                            name="plus"
                            size={14}
                            color={PRIMARY_COLOR}
                        />
                        <Text style={styles.followText}>Follow</Text>
                    </TouchableOpacity>
                )}
            </>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderColor: '#E5E7EB',
        borderBottomWidth: 1,
    },
    leftColumnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    usernameText: {
        marginLeft: 5,
    },
    rightColumnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    followText: {
        marginLeft: 3,
    },
});
