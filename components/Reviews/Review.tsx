import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import UserAvatar from '@/components/User/UserAvatar';
import { ListReviewType } from '@/services/queries/review';
import { useNavigation } from '@react-navigation/native';
import RatingsStarViewer from '@/components/Ratings/RatingsStarsViewer';

type ReviewProps = {
    review: ListReviewType;
    noBorder?: boolean;
};

const MAX_LINES_LENGTH = 4;

export default function Review({ review, noBorder }: ReviewProps) {
    const navigation = useNavigation();

    return (
        <TouchableHighlight
            underlayColor="#E5E7EB"
            activeOpacity={1}
            style={[
                styles.container,
                noBorder === true ? styles.noBorder : undefined,
            ]}
            onPress={() =>
                navigation.navigate('ViewReview', { reviewId: review.id })
            }>
            <View>
                <View style={styles.headerContainer}>
                    <View style={styles.starsContainer}>
                        <RatingsStarViewer
                            amount={review.rating}
                            size={14}
                            padding={1}
                        />
                    </View>

                    <View style={styles.userContainer}>
                        <View style={styles.usernameContainer}>
                            <Text style={styles.usernameText}>
                                {review.user.username}
                            </Text>
                        </View>

                        <View style={styles.avatarContainer}>
                            <UserAvatar
                                size={20}
                                photo={review.user.profile_photo || ''}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <Text
                        style={styles.contentText}
                        numberOfLines={MAX_LINES_LENGTH}>
                        {review.content}
                    </Text>
                </View>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 25,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderColor: '#E5E7EB',
    },
    noBorder: {
        borderTopWidth: 0,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
    },
    avatarContainer: {},
    usernameContainer: {
        marginRight: 10,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    usernameText: {
        fontSize: 12,
        fontWeight: '600',
    },
    optionsContainer: {
        paddingTop: 10,
    },
    contentContainer: {
        paddingTop: 15,
        paddingHorizontal: 25,
    },
    contentText: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.6,
    },
    seeLessContainer: {
        alignSelf: 'flex-end',
    },
});
