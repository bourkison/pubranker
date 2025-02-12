import React, { useMemo } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Octicons } from '@expo/vector-icons';

type PubFeatureProps = {
    title: string;
    input: boolean | null;
    onPress?: () => void;
    hideOnNull?: boolean;
    marginBottom?: number;
    marginHorizontal?: number;
};

const TRUE_COLOR = '#000';
const DIM_COLOR = '#A3A3A3';

export default function PubFeature({
    input,
    title,
    onPress,
    hideOnNull = true,
    marginBottom = 10,
    marginHorizontal = 5,
}: PubFeatureProps) {
    const containerStyle = useMemo(() => {
        if (input === true) {
            return styles.trueFeatureContainer;
        }

        if (input === false && !hideOnNull) {
            return styles.trueFeatureContainer;
        }

        return styles.dimFeatureContainer;
    }, [input, hideOnNull]);

    const featureStyle = useMemo(() => {
        if (input === true) {
            return styles.trueFeature;
        }

        if (input === false && !hideOnNull) {
            return styles.trueFeature;
        }

        return styles.dimFeature;
    }, [input, hideOnNull]);

    const featurePress = () => {
        if (onPress) {
            onPress();
        }
    };

    if (input === null && hideOnNull === true) {
        return null;
    }

    return (
        <TouchableOpacity
            onPress={featurePress}
            disabled={!onPress}
            style={[
                styles.featureContainer,
                { marginBottom, marginHorizontal },
                containerStyle,
            ]}>
            {input === true ? (
                <Octicons name="check" size={12} color={TRUE_COLOR} />
            ) : input === false ? (
                <Octicons
                    name="x"
                    size={12}
                    color={hideOnNull ? DIM_COLOR : TRUE_COLOR}
                />
            ) : undefined}
            <Text style={[styles.featureText, featureStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    featureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4,
        paddingVertical: 2,
        paddingHorizontal: 5,
    },
    trueFeatureContainer: {
        borderColor: TRUE_COLOR,
    },
    dimFeatureContainer: {
        borderColor: DIM_COLOR,
    },
    featureText: {
        fontSize: 12,
    },
    trueFeature: {
        marginLeft: 3,
    },
    dimFeature: {
        marginLeft: 3,
        color: '#a3a3a3',
        fontFamily: 'JostLight',
    },
});
