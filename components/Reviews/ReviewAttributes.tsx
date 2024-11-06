import { PRIMARY_COLOR } from '@/constants';
import { ReviewType } from '@/context/pubViewContext';
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';

type ReviewAttributesProps =
    | {
          review: ReviewType;
          withComment?: false;
      }
    | {
          review: ReviewType;
          withComment: true;
          onCreateCommentPress: () => void;
      };

export default function ReviewAttributes(props: ReviewAttributesProps) {
    return (
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            bounces={false}>
            <Pressable style={styles.container}>
                {props.withComment === true ? (
                    <Pressable
                        style={[
                            styles.generalContainer,
                            styles.positiveContainer,
                        ]}
                        onPress={props.onCreateCommentPress}>
                        <Text style={[styles.generalText, styles.positiveText]}>
                            Comment
                        </Text>
                    </Pressable>
                ) : undefined}

                {/* Positive attributes */}
                {props.review.vibe === true ? (
                    <View
                        style={[
                            styles.generalContainer,
                            styles.positiveContainer,
                        ]}>
                        <Text style={[styles.generalText, styles.positiveText]}>
                            Good vibes
                        </Text>
                    </View>
                ) : undefined}

                {props.review.service === true ? (
                    <View
                        style={[
                            styles.generalContainer,
                            styles.positiveContainer,
                        ]}>
                        <Text style={[styles.generalText, styles.positiveText]}>
                            Good service
                        </Text>
                    </View>
                ) : undefined}

                {props.review.beer === true ? (
                    <View
                        style={[
                            styles.generalContainer,
                            styles.positiveContainer,
                        ]}>
                        <Text style={[styles.generalText, styles.positiveText]}>
                            Good beer
                        </Text>
                    </View>
                ) : undefined}

                {props.review.food === true ? (
                    <View
                        style={[
                            styles.generalContainer,
                            styles.positiveContainer,
                        ]}>
                        <Text style={[styles.generalText, styles.positiveText]}>
                            Good food
                        </Text>
                    </View>
                ) : undefined}

                {props.review.location === true ? (
                    <View
                        style={[
                            styles.generalContainer,
                            styles.positiveContainer,
                        ]}>
                        <Text style={[styles.generalText, styles.positiveText]}>
                            Good location
                        </Text>
                    </View>
                ) : undefined}

                {props.review.music === true ? (
                    <View
                        style={[
                            styles.generalContainer,
                            styles.positiveContainer,
                        ]}>
                        <Text style={[styles.generalText, styles.positiveText]}>
                            Good music
                        </Text>
                    </View>
                ) : undefined}

                {/* Negative attributes */}
                {props.review.vibe === false ? (
                    <View
                        style={[
                            styles.generalContainer,
                            styles.negativeContainer,
                        ]}>
                        <Text style={[styles.generalText, styles.negativeText]}>
                            Bad vibes
                        </Text>
                    </View>
                ) : undefined}

                {props.review.service === false ? (
                    <View
                        style={[
                            styles.generalContainer,
                            styles.negativeContainer,
                        ]}>
                        <Text style={[styles.generalText, styles.negativeText]}>
                            Bad service
                        </Text>
                    </View>
                ) : undefined}

                {props.review.beer === false ? (
                    <View
                        style={[
                            styles.generalContainer,
                            styles.negativeContainer,
                        ]}>
                        <Text style={[styles.generalText, styles.negativeText]}>
                            Bad beer
                        </Text>
                    </View>
                ) : undefined}

                {props.review.food === false ? (
                    <View
                        style={[
                            styles.generalContainer,
                            styles.negativeContainer,
                        ]}>
                        <Text style={[styles.generalText, styles.negativeText]}>
                            Bad food
                        </Text>
                    </View>
                ) : undefined}

                {props.review.location === false ? (
                    <View
                        style={[
                            styles.generalContainer,
                            styles.negativeContainer,
                        ]}>
                        <Text style={[styles.generalText, styles.negativeText]}>
                            Bad location
                        </Text>
                    </View>
                ) : undefined}

                {props.review.music === false ? (
                    <View
                        style={[
                            styles.generalContainer,
                            styles.negativeContainer,
                        ]}>
                        <Text style={[styles.generalText, styles.negativeText]}>
                            Bad music
                        </Text>
                    </View>
                ) : undefined}
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingLeft: 15,
    },
    generalContainer: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
        marginRight: 5,
    },
    generalText: {
        fontSize: 10,
    },
    positiveContainer: {
        backgroundColor: PRIMARY_COLOR,
        borderColor: PRIMARY_COLOR,
        borderWidth: 2,
    },
    positiveText: {
        color: '#fff',
    },
    negativeContainer: {
        borderColor: PRIMARY_COLOR,
        borderWidth: 2,
    },
    negativeText: {
        color: PRIMARY_COLOR,
    },
});
