import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

type RatingsBarProps = {
    height?: number;
    backgroundColor?: string;
    progressColor?: string;
    borderRadius?: number;
    current: number;
    max: number;
};

export default function RatingsBar({
    height = 10,
    backgroundColor = '#E5E7EB',
    progressColor = '#FFD700',
    borderRadius = 3,
    current,
    max,
}: RatingsBarProps) {
    const progress = useMemo(() => {
        let res = current;

        if (res > max) {
            res = max;
        }

        res = Math.round((res / max) * 100);

        return `${res}%`;
    }, [current, max]);

    return (
        <View
            style={[
                styles.backgroundBar,
                {
                    borderRadius: borderRadius,
                    height: height,
                    backgroundColor: backgroundColor,
                },
            ]}>
            <View
                style={[
                    styles.progressBar,
                    {
                        borderRadius: borderRadius,
                        height: height,
                        width: progress,
                        backgroundColor: progressColor,
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundBar: {
        width: '100%',
    },
    progressBar: {
        position: 'absolute',
        left: 0,
    },
});
