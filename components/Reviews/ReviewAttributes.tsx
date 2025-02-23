import { PRIMARY_COLOR } from '@/constants';
import { ReviewType } from '@/services/queries/review';
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Gallery from '@/components/Utility/Gallery';
import Collapsible from 'react-native-collapsible';

type ReviewAttributesProps = {
    review: ReviewType;
};

export default function ReviewAttributes({ review }: ReviewAttributesProps) {
    const [imagesCollapsed, setImagesCollapsed] = useState(true);

    return (
        <View>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
                bounces={true}>
                <View style={styles.container}>
                    {/* Images */}
                    {review.photos.length > 0 ? (
                        <View
                            style={[
                                styles.generalContainer,
                                styles.positiveContainer,
                            ]}>
                            <Pressable
                                style={styles.photosContainer}
                                onPress={() =>
                                    setImagesCollapsed(!imagesCollapsed)
                                }>
                                <View style={styles.imageIconContainer}>
                                    <Ionicons
                                        name="grid"
                                        color="#fff"
                                        size={12}
                                    />
                                </View>
                                <Text
                                    style={[
                                        styles.generalText,
                                        styles.positiveText,
                                    ]}>
                                    {review.photos.length} Photos
                                </Text>
                            </Pressable>
                        </View>
                    ) : undefined}

                    {/* Positive attributes */}
                    {review.vibe === true ? (
                        <View
                            style={[
                                styles.generalContainer,
                                styles.positiveContainer,
                            ]}>
                            <Text
                                style={[
                                    styles.generalText,
                                    styles.positiveText,
                                ]}>
                                Good vibes
                            </Text>
                        </View>
                    ) : undefined}

                    {review.service === true ? (
                        <View
                            style={[
                                styles.generalContainer,
                                styles.positiveContainer,
                            ]}>
                            <Text
                                style={[
                                    styles.generalText,
                                    styles.positiveText,
                                ]}>
                                Good service
                            </Text>
                        </View>
                    ) : undefined}

                    {review.beer === true ? (
                        <View
                            style={[
                                styles.generalContainer,
                                styles.positiveContainer,
                            ]}>
                            <Text
                                style={[
                                    styles.generalText,
                                    styles.positiveText,
                                ]}>
                                Good beer
                            </Text>
                        </View>
                    ) : undefined}

                    {review.food === true ? (
                        <View
                            style={[
                                styles.generalContainer,
                                styles.positiveContainer,
                            ]}>
                            <Text
                                style={[
                                    styles.generalText,
                                    styles.positiveText,
                                ]}>
                                Good food
                            </Text>
                        </View>
                    ) : undefined}

                    {review.location === true ? (
                        <View
                            style={[
                                styles.generalContainer,
                                styles.positiveContainer,
                            ]}>
                            <Text
                                style={[
                                    styles.generalText,
                                    styles.positiveText,
                                ]}>
                                Good location
                            </Text>
                        </View>
                    ) : undefined}

                    {review.music === true ? (
                        <View
                            style={[
                                styles.generalContainer,
                                styles.positiveContainer,
                            ]}>
                            <Text
                                style={[
                                    styles.generalText,
                                    styles.positiveText,
                                ]}>
                                Good music
                            </Text>
                        </View>
                    ) : undefined}

                    {/* Negative attributes */}
                    {review.vibe === false ? (
                        <View
                            style={[
                                styles.generalContainer,
                                styles.negativeContainer,
                            ]}>
                            <Text
                                style={[
                                    styles.generalText,
                                    styles.negativeText,
                                ]}>
                                Bad vibes
                            </Text>
                        </View>
                    ) : undefined}

                    {review.service === false ? (
                        <View
                            style={[
                                styles.generalContainer,
                                styles.negativeContainer,
                            ]}>
                            <Text
                                style={[
                                    styles.generalText,
                                    styles.negativeText,
                                ]}>
                                Bad service
                            </Text>
                        </View>
                    ) : undefined}

                    {review.beer === false ? (
                        <View
                            style={[
                                styles.generalContainer,
                                styles.negativeContainer,
                            ]}>
                            <Text
                                style={[
                                    styles.generalText,
                                    styles.negativeText,
                                ]}>
                                Bad beer
                            </Text>
                        </View>
                    ) : undefined}

                    {review.food === false ? (
                        <View
                            style={[
                                styles.generalContainer,
                                styles.negativeContainer,
                            ]}>
                            <Text
                                style={[
                                    styles.generalText,
                                    styles.negativeText,
                                ]}>
                                Bad food
                            </Text>
                        </View>
                    ) : undefined}

                    {review.location === false ? (
                        <View
                            style={[
                                styles.generalContainer,
                                styles.negativeContainer,
                            ]}>
                            <Text
                                style={[
                                    styles.generalText,
                                    styles.negativeText,
                                ]}>
                                Bad location
                            </Text>
                        </View>
                    ) : undefined}

                    {review.music === false ? (
                        <View
                            style={[
                                styles.generalContainer,
                                styles.negativeContainer,
                            ]}>
                            <Text
                                style={[
                                    styles.generalText,
                                    styles.negativeText,
                                ]}>
                                Bad music
                            </Text>
                        </View>
                    ) : undefined}
                </View>
            </ScrollView>

            {review.photos.length > 0 && (
                <Collapsible collapsed={imagesCollapsed} align="top">
                    <View style={styles.galleryContainer}>
                        <Gallery
                            photos={review.photos}
                            type="reviews"
                            percentageWidth={0.8}
                            margin={0}
                        />
                    </View>
                </Collapsible>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingLeft: 5,
    },
    contentContainer: {
        paddingHorizontal: 15,
    },
    photosContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageIconContainer: {
        marginRight: 3,
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
    galleryContainer: {
        marginTop: 10,
        marginBottom: 5,
    },
});
