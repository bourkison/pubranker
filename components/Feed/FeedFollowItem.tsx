import { FeedType } from '@/services/queries/feed';
import React from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    Pressable,
    StyleSheet,
} from 'react-native';
import UserAvatar from '@/components/User/UserAvatar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';

type FeedFollowItemProps = {
    user: FeedType['user'];
    follow: NonNullable<FeedType['follow']>;
};

export default function FeedFollowItem({ follow, user }: FeedFollowItemProps) {
    const navigation =
        useNavigation<StackNavigationProp<MainNavigatorStackParamList>>();

    return (
        <TouchableHighlight
            style={styles.container}
            underlayColor="#E5E7EB"
            onPress={() =>
                navigation.navigate('Profile', { userId: follow.user.id })
            }>
            <>
                <Pressable
                    style={styles.avatarPressable}
                    onPress={() =>
                        navigation.navigate('Profile', { userId: user.id })
                    }>
                    <UserAvatar size={24} photo={user.profile_photo} />
                </Pressable>

                <View style={styles.textContentContainer}>
                    <Text style={styles.text}>
                        <Text style={styles.boldText}>{user.username}</Text>{' '}
                        followed{' '}
                        <Text style={styles.boldText}>
                            {follow.user.username}
                        </Text>
                    </Text>
                </View>
            </>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    avatarPressable: {
        flexDirection: 'row',
        marginRight: 10,
    },
    textContentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
    },
    text: {
        fontSize: 12,
    },
    boldText: {
        fontWeight: '500',
    },
});
