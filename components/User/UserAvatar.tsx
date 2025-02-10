import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '@/constants';

type UserAvatarProps = {
    size: number;
    photo: string;
    backgroundColor?: string;
    iconColor?: string;
    withShadow?: boolean;
};

export default function UserAvatar({
    size,
    photo,
    backgroundColor = PRIMARY_COLOR,
    iconColor = '#FFF',
    withShadow,
}: UserAvatarProps) {
    const iconSize = useMemo(() => size / 1.66666, [size]);
    // const padding = useMemo(() => size - iconSize, [iconSize, size])

    return (
        <View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: backgroundColor,
                },
                withShadow ? styles.shadow : undefined,
            ]}>
            {photo ? undefined : (
                <Ionicons name="person" size={iconSize} color={iconColor} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    shadow: {
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 0,
        },
    },
});
