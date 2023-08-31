import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GOLD_RATINGS_COLOR } from '@/constants';

type StarsDisplayerProps = {
    rating: number;
    size: number;
    overlayColor?: string;
};

export default function StarsDisplayer({
    rating,
    size,
    overlayColor = '#FFF',
}: StarsDisplayerProps) {
    const arrayedRating = useMemo(() => {
        let arr = [];

        for (let i = 0; i < Math.ceil(rating); i++) {
            if (i + 1 > rating) {
                arr.push(rating - i);
                break;
            }

            arr.push(1);
            console.log(Math.ceil(rating), i + 1, rating, arr);
        }

        console.log('ARRAY', arr);

        return arr;
    }, [rating]);

    return (
        <>
            {arrayedRating.map((r, index) => {
                if (index === arrayedRating.length - 1) {
                    return (
                        <View key={index}>
                            <Ionicons
                                name="star"
                                color={GOLD_RATINGS_COLOR}
                                size={size}
                            />
                            <View
                                style={[
                                    styles.overlay,
                                    {
                                        backgroundColor: overlayColor,
                                        width: size * (1 - r),
                                    },
                                ]}
                            />
                        </View>
                    );
                }

                return (
                    <View key={index}>
                        <Ionicons
                            name="star"
                            color={GOLD_RATINGS_COLOR}
                            size={size}
                        />
                    </View>
                );
            })}
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
    },
});
