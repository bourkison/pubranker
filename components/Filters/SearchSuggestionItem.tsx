import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

type SearchSuggestionItemProps = {
    title: string;
    subtitle?: string;
    type: 'pub' | 'station' | 'park' | 'landmark' | 'area' | 'nearby';
    onPress?: () => void;
};

export default function SearchSuggestionItem({
    type,
    title,
    subtitle,
    onPress,
}: SearchSuggestionItemProps) {
    const icon = useMemo(() => {
        switch (type) {
            case 'pub':
                return (
                    <Ionicons color="#6E7271" size={28} name="beer-outline" />
                );
            case 'area':
                return (
                    <Ionicons
                        color="#6E7271"
                        size={28}
                        name="location-outline"
                    />
                );
            case 'landmark':
                return (
                    <Ionicons
                        color="#6E7271"
                        size={28}
                        name="location-outline"
                    />
                );
            case 'nearby':
                return <Feather color="#6E7271" size={24} name="navigation" />;
            case 'park':
                return (
                    <Ionicons color="#6E7271" size={28} name="leaf-outline" />
                );
            case 'station':
                return (
                    <Ionicons color="#6E7271" size={28} name="train-outline" />
                );
        }
    }, [type]);

    return (
        <Pressable style={styles.container} onPress={onPress}>
            <View style={styles.imageContainer}>{icon}</View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? (
                    <Text style={styles.subtitle}>{subtitle}</Text>
                ) : undefined}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        alignItems: 'center',
    },
    imageContainer: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        width: 48,
        height: 48,
        backgroundColor: '#D8D4D5',
        borderRadius: 8,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        marginLeft: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '200',
    },
});
