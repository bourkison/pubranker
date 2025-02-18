import { FeedType } from '@/services/queries/feed';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableHighlight,
} from 'react-native';
import UserAvatar from '../User/UserAvatar';
import { useNavigation } from '@react-navigation/native';
import { fromNowString } from '@/services';

type FeedReviewLikeItemProps = {
    user: FeedType['user'];
    reviewLike: NonNullable<FeedType['review_like']>;
    createdAt: string;
};

export default function FeedReviewLikeItem({
    user,
    reviewLike,
    createdAt,
}: FeedReviewLikeItemProps) {
    const navigation = useNavigation();

    return (
        <TouchableHighlight
            underlayColor="#E5E7EB"
            style={styles.touchable}
            onPress={() =>
                navigation.navigate('ViewReview', {
                    reviewId: reviewLike.review.id,
                })
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
                            liked{' '}
                            <Text style={styles.boldText}>
                                {reviewLike.review.user.username}
                            </Text>
                            's review of{' '}
                            <Text style={styles.boldText}>
                                {reviewLike.review.pub.name}
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
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
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
