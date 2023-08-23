import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GOLD_RATINGS_COLOR } from '@/constants';

type StarRankerProps = {
    selected: number;
    setSelected: (amount: number) => void;
};

const STAR_SIZE = 32;

export default function StarRanker({ selected, setSelected }: StarRankerProps) {
    return (
        <>
            {Array.from(Array(5)).map((_, index) => (
                <Pressable
                    key={index}
                    style={styles.starContainer}
                    onPress={() => setSelected(index + 1)}>
                    {index < selected ? (
                        <Ionicons
                            name="star"
                            size={STAR_SIZE}
                            color={GOLD_RATINGS_COLOR}
                        />
                    ) : (
                        <Ionicons
                            name="star-outline"
                            size={STAR_SIZE}
                            color={GOLD_RATINGS_COLOR}
                        />
                    )}
                </Pressable>
            ))}
        </>
    );
}

const styles = StyleSheet.create({
    starContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
