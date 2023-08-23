import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type UserAvatarProps = {
    size: number;
    photo: string;
    backgroundColor?: string;
    iconColor?: string;
};

export default function UserAvatar({
    size,
    photo,
    backgroundColor = '#384D48',
    iconColor = '#FFF',
}: UserAvatarProps) {
    const padding = useMemo(() => size / 1.5, [size]);
    const containerSize = useMemo(() => size + padding, [size, padding]);

    return (
        <View
            style={[
                styles.container,
                {
                    width: containerSize,
                    height: containerSize,
                    borderRadius: containerSize / 2,
                    backgroundColor: backgroundColor,
                },
            ]}>
            {photo ? undefined : (
                <Ionicons name="person" size={size} color={iconColor} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
