import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '@/constants';
import { supabase } from '@/services/supabase';

type UserAvatarProps = {
    size: number;
    photo: string;
    backgroundColor?: string;
    iconColor?: string;
    withShadow?: boolean;
    getPublicUrl?: boolean;
};

export default function UserAvatar({
    size,
    photo,
    backgroundColor = PRIMARY_COLOR,
    iconColor = '#FFF',
    withShadow,
    getPublicUrl = true,
}: UserAvatarProps) {
    const iconSize = useMemo(() => size / 1.66666, [size]);
    // const padding = useMemo(() => size - iconSize, [iconSize, size])

    const image = useMemo<string>(() => {
        if (!photo) {
            return '';
        }

        if (getPublicUrl) {
            return supabase.storage.from('users').getPublicUrl(photo).data
                .publicUrl;
        }

        return photo;
    }, [photo, getPublicUrl]);

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
            {image !== '' ? (
                <Image
                    source={{ uri: image }}
                    style={{
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                    }}
                />
            ) : (
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
