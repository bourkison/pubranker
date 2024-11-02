import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { GOLD_RATINGS_COLOR } from '@/constants';

type RatingsStarViewerProps = {
    amount: number;
    padding: number;
    size: number;
    withShadows?: boolean;
};

export default function RatingsStarViewer({
    amount,
    size,
    padding,
    withShadows = false,
}: RatingsStarViewerProps) {
    return (
        <>
            {Array.from(Array(Math.floor(amount / 2))).map((_, index) => (
                <Ionicons
                    key={index}
                    name="star"
                    style={{ paddingHorizontal: padding }}
                    color={GOLD_RATINGS_COLOR}
                    size={size}
                />
            ))}
            {amount % 2 === 1 ? (
                <Ionicons
                    name="star-half"
                    style={{ paddingHorizontal: padding }}
                    color={GOLD_RATINGS_COLOR}
                    size={size}
                />
            ) : undefined}
            {withShadows
                ? Array.from(Array(5 - Math.ceil(amount / 2))).map(
                      (_, index) => (
                          <Ionicons
                              key={index}
                              name="star"
                              color="rgba(0, 0, 0, 0.2)"
                          />
                      ),
                  )
                : undefined}
        </>
    );
}