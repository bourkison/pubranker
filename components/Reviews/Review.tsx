import React, { useMemo, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextLayoutEventData,
    NativeSyntheticEvent,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fromNowString, roundToNearest } from '@/services';
import { PubSchema, UserReviewType } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';

type ReviewProps = {
    review: UserReviewType;
    pub: PubSchema;
};

const MAX_LINES_LENGTH = 4;

export default function Review({ review }: ReviewProps) {
    const navigation =
        useNavigation<StackNavigationProp<MainNavigatorStackParamList>>();

    const [textShown, setTextShown] = useState(false);
    const [lengthMore, setLengthMore] = useState(false);

    const onTextLayout = useCallback(
        (e: NativeSyntheticEvent<TextLayoutEventData>) => {
            setLengthMore(e.nativeEvent.lines.length >= MAX_LINES_LENGTH);
        },
        [],
    );

    const toggleText = () => {
        setTextShown(!textShown);
    };

    const averageReview = useMemo(() => {
        const r =
            (review.beer +
                review.food +
                review.location +
                review.music +
                review.service +
                review.vibe) /
            6;
        return roundToNearest(r, 0.1).toFixed(1);
    }, [review]);

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.averageReviewContainer}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.averageReviewText}>
                        {averageReview}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('ViewReview', {
                            review: review,
                            onEdit(edit) {
                                console.log('edit', edit);
                            },
                            onDelete() {
                                console.log('delete');
                            },
                        })
                    }>
                    <Text
                        numberOfLines={textShown ? undefined : MAX_LINES_LENGTH}
                        onTextLayout={onTextLayout}>
                        {review.content}
                    </Text>
                </TouchableOpacity>
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
            <View style={styles.nameContainer}>
                <Text style={styles.nameText}>
                    {review.user_name}, {fromNowString(review.created_at)}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        borderColor: '#E5E7EB',
        borderBottomWidth: 1,
        paddingHorizontal: 10,
    },
    contentContainer: {},
    averageReviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    averageReviewText: {
        paddingLeft: 3,
        color: '#A3A3A3',
    },
    nameContainer: {},
    nameText: {
        color: '#A3A3A3',
        fontSize: 12,
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
});
