import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Octicons } from '@expo/vector-icons';

type PubFeatureProps = {
    title: string;
    input: boolean | null;
    onPress?: () => void;
};

const TRUE_COLOR = '#000';
const FALSE_COLOR = '#A3A3A3';

export default function PubFeature({ input, title, onPress }: PubFeatureProps) {
    const featurePress = () => {
        if (onPress) {
            onPress();
        }
    };

    if (input === null && onPress === undefined) {
        return null;
    }

    return (
        <TouchableOpacity
            onPress={featurePress}
            style={[
                styles.featureContainer,
                input
                    ? styles.trueFeatureContainer
                    : styles.falseFeatureContainer,
            ]}>
            {input === true ? (
                <Octicons name="check" size={12} color={TRUE_COLOR} />
            ) : input === false ? (
                <Octicons name="x" size={12} color={FALSE_COLOR} />
            ) : undefined}
            <Text
                style={[
                    styles.featureText,
                    input ? styles.trueFeature : styles.falseFeature,
                ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    featureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 4,
        marginHorizontal: 5,
        paddingVertical: 2,
        paddingHorizontal: 5,
    },
    trueFeatureContainer: {
        borderColor: TRUE_COLOR,
    },
    falseFeatureContainer: {
        borderColor: FALSE_COLOR,
    },
    featureText: {
        fontSize: 12,
    },
    trueFeature: {
        marginLeft: 3,
    },
    falseFeature: {
        marginLeft: 3,
        color: '#a3a3a3',
        fontFamily: 'JostLight',
    },
});
