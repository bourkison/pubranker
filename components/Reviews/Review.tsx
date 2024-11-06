import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextLayoutEventData,
    NativeSyntheticEvent,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native';
import { fromNowString } from '@/services';
import { PubSchema } from '@/types';
import UserAvatar from '@/components/User/UserAvatar';
import {
    ListReviewType,
    useSharedPubViewContext,
} from '@/context/pubViewContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import RatingsStarViewer from '@/components/Ratings/RatingsStarsViewer';
import ReviewAttributes from '@/components/Reviews/ReviewAttributes';

type ReviewProps = {
    review: ListReviewType;
    pub: PubSchema;
    noBorder?: boolean;
};

const MAX_LINES_LENGTH = 4;

export default function Review({ review, noBorder }: ReviewProps) {
    const [textShown, setTextShown] = useState(false);
    const [lengthMore, setLengthMore] = useState(false);

    const navigation =
        useNavigation<StackNavigationProp<MainNavigatorStackParamList>>();

    const { calculateWithinScrollBounds } = useSharedPubViewContext();

    const onTextLayout = useCallback(
        (e: NativeSyntheticEvent<TextLayoutEventData>) => {
            setLengthMore(e.nativeEvent.lines.length >= MAX_LINES_LENGTH);
            console.log('TEXT', review);
        },
        [review],
    );

    const toggleText = () => {
        setTextShown(!textShown);
    };

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
            }
            onLayout={() => calculateWithinScrollBounds(false)}>
            <View>
                <View style={styles.headerContainer}>
                    <View style={styles.avatarContainer}>
                        <UserAvatar size={24} photo="" />
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.nameText}>{review.user.name}</Text>
                        <View style={styles.bottomHeaderRow}>
                            <RatingsStarViewer
                                amount={review.rating}
                                size={14}
                                padding={1}
                            />
                            <Text style={styles.dateText}>
                                {fromNowString(review.created_at)}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.optionsContainer}>
                    <ReviewAttributes review={review} withComment={false} />
                </View>

                <View style={styles.contentContainer}>
                    <Text
                        style={styles.contentText}
                        numberOfLines={textShown ? undefined : MAX_LINES_LENGTH}
                        onTextLayout={onTextLayout}>
                        {review.content}
                    </Text>
                    {lengthMore ? (
                        <TouchableOpacity
                            onPress={toggleText}
                            style={
                                textShown
                                    ? styles.seeLessContainer
                                    : styles.seeMoreContainer
                            }>
                            <Text style={styles.toggleTextText}>
                                {textShown ? 'See Less' : '... See More'}
                            </Text>
                        </TouchableOpacity>
                    ) : undefined}
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
        paddingHorizontal: 25,
    },
    avatarContainer: {},
    headerTextContainer: {
        paddingLeft: 10,
    },
    bottomHeaderRow: {
        flexDirection: 'row',
        paddingTop: 4,
        alignItems: 'center',
    },
    starContainer: {
        paddingHorizontal: 2,
    },
    nameText: {
        fontSize: 16,
        fontWeight: '500',
    },
    dateText: {
        fontSize: 12,
        opacity: 0.4,
        paddingLeft: 5,
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
    seeMoreContainer: {
        alignSelf: 'flex-end',
        marginTop: -17,
        backgroundColor: 'white',
    },
    toggleTextText: {
        color: '#A3A3A3',
    },
    isHelpfulContainer: {
        paddingTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    likedText: {
        marginLeft: 3,
        fontWeight: '300',
        fontSize: 10,
    },
});
