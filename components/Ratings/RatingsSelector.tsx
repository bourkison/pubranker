import React, { useCallback, useState } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GOLD_RATINGS_COLOR } from '@/constants';

type RatingsSelectorProps = {
    onRating: (amount: number) => void;
    starSize: number;
    starPadding: number;
    rating: number;
};

export default function RatingsSelector({
    starSize,
    starPadding,
    onRating,
    rating,
}: RatingsSelectorProps) {
    const [containerWidth, setContainerWidth] = useState(0);

    const calculateStar = useCallback(
        (sel: number, i: number) => {
            // Calc half star first
            if (i * 2 + 1 === sel) {
                return (
                    <Ionicons
                        name="star-half-outline"
                        size={starSize}
                        color={GOLD_RATINGS_COLOR}
                    />
                );
            }

            if (i * 2 < sel) {
                return (
                    <Ionicons
                        name="star"
                        size={starSize}
                        color={GOLD_RATINGS_COLOR}
                    />
                );
            }

            return (
                <Ionicons
                    name="star-outline"
                    size={starSize}
                    color={GOLD_RATINGS_COLOR}
                />
            );
        },
        [starSize],
    );

    return (
        <>
            {Array.from(Array(5)).map((_, index) => (
                <View
                    key={index}
                    style={{
                        paddingHorizontal: starPadding,
                    }}
                    onLayout={({
                        nativeEvent: {
                            layout: { width },
                        },
                    }) => setContainerWidth(width)}>
                    <Pressable
                        style={[
                            styles.pressableLeft,
                            {
                                width: containerWidth / 2,
                                height: starSize,
                            },
                        ]}
                        onPress={() => onRating(index * 2 + 1)}
                    />
                    <Pressable
                        style={[
                            styles.pressableRight,
                            {
                                width: containerWidth / 2,
                                height: starSize,
                            },
                        ]}
                        onPress={() => onRating(index * 2 + 2)}
                    />
                    {calculateStar(rating, index)}
                </View>
            ))}
        </>
    );
}

const styles = StyleSheet.create({
    pressableLeft: {
        position: 'absolute',
        left: 0,
        zIndex: 9,
    },
    pressableRight: {
        position: 'absolute',
        right: 0,
        zIndex: 9,
    },
});
