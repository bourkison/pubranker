import { FeedType } from '@/services/queries/feed';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import UserAvatar from '../User/UserAvatar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';

type FeedReviewLikeItemProps = {
    user: FeedType['user'];
    reviewLike: NonNullable<FeedType['review_likes']>;
};

export default function FeedReviewLikeItem({
    user,
    reviewLike,
}: FeedReviewLikeItemProps) {
    const navigation =
        useNavigation<StackNavigationProp<MainNavigatorStackParamList>>();

    return (
        <Pressable
            style={styles.container}
            onPress={() =>
                navigation.navigate('ViewReview', {
                    reviewId: reviewLike.review.id,
                })
            }>
            <Pressable style={styles.avatarPressable}>
                <UserAvatar size={28} photo={user.profile_photo} />
            </Pressable>
            <View style={styles.textContentContainer}>
                <Text style={styles.text}>
                    <Text style={styles.boldText}>{user.username}</Text> liked{' '}
                    <Text style={styles.boldText}>
                        {reviewLike.review.user.username}
                    </Text>
                    's review on{' '}
                    <Text style={styles.boldText}>
                        {reviewLike.review.pub.name}
                    </Text>
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: 20,
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
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    boldText: {
        fontWeight: '500',
    },
    inlinePressable: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
