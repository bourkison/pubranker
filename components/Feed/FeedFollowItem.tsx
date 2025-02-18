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
import { fromNowString } from '@/services';

type FeedFollowItemProps = {
    user: FeedType['user'];
    follow: NonNullable<FeedType['follow']>;
    createdAt: string;
};

export default function FeedFollowItem({
    follow,
    user,
    createdAt,
}: FeedFollowItemProps) {
    const navigation = useNavigation();

    return (
        <TouchableHighlight
            style={styles.touchable}
            underlayColor="#E5E7EB"
            onPress={() =>
                navigation.navigate('Profile', { userId: follow.user.id })
            }>
            <View style={styles.container}>
                <View style={styles.contentContainer}>
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
                </View>

                <View>
                    <Text style={styles.fromNowText}>
                        {fromNowString(createdAt)}
                    </Text>
                </View>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    touchable: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
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
    fromNowText: {
        fontSize: 10,
        fontWeight: '300',
    },
});
