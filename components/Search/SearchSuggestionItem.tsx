import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ResultType } from '@/context/searchContext';

type SearchSuggestionItemProps = {
    result: ResultType;
};

export default function SearchSuggestionItem({
    result,
}: SearchSuggestionItemProps) {
    const icon = useMemo(() => {
        switch (result.type) {
            case 'pub':
                return (
                    <Ionicons color="#6E7271" size={28} name="beer-outline" />
                );
            case 'region':
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
    }, [result]);

    return (
        <Pressable style={styles.container} onPress={result.onPress}>
            <View style={styles.imageContainer}>{icon}</View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{result.title}</Text>
                {result.subtitle && (
                    <Text style={styles.subtitle}>{result.subtitle}</Text>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
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
