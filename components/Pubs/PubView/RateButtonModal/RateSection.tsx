import { PubSchema } from '@/types';
import React, { useCallback, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GOLD_RATINGS_COLOR } from '@/constants';

type RateSectionProps = {
    pub: PubSchema;
};

const STAR_SIZE = 40;
const STAR_PADDING = 4;

export default function RateSection({}: RateSectionProps) {
    const [selected, setSelected] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const starContainerRef = useRef<View>(null);

    const measureContainer = useCallback(() => {
        if (containerWidth !== 0) {
            return;
        }

        starContainerRef.current?.measure((x, y, width) => {
            setContainerWidth(width);
        });
    }, [containerWidth]);

    const calculateStar = useCallback((sel: number, i: number) => {
        // Calc half star first
        if (i * 2 + 1 === sel) {
            return (
                <Ionicons
                    name="star-half-outline"
                    size={STAR_SIZE}
                    color={GOLD_RATINGS_COLOR}
                />
            );
        }

        if (i * 2 < sel) {
            return (
                <Ionicons
                    name="star"
                    size={STAR_SIZE}
                    color={GOLD_RATINGS_COLOR}
                />
            );
        }

        return (
            <Ionicons
                name="star-outline"
                size={STAR_SIZE}
                color={GOLD_RATINGS_COLOR}
            />
        );
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Rate</Text>
            <View style={styles.starsContainer}>
                {Array.from(Array(5)).map((_, index) => (
                    <View
                        style={styles.starContainer}
                        ref={starContainerRef}
                        onLayout={measureContainer}>
                        <Pressable
                            style={[
                                styles.pressableLeft,
                                {
                                    width: containerWidth / 2,
                                    height: STAR_SIZE,
                                },
                            ]}
                            onPress={() => setSelected(index * 2 + 1)}
                        />
                        <Pressable
                            style={[
                                styles.pressableRight,
                                {
                                    width: containerWidth / 2,
                                    height: STAR_SIZE,
                                },
                            ]}
                            onPress={() => setSelected(index * 2 + 2)}
                        />
                        {calculateStar(selected, index)}
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '300',
    },
    starsContainer: {
        flexDirection: 'row',
        position: 'relative',
        paddingVertical: 10,
    },
    starContainer: {
        paddingHorizontal: STAR_PADDING,
    },
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
