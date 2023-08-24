import { BoolOrUnset } from '@/types';
import React, { useMemo } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

type FilterToggleItemProps = {
    title: string;
    onPress: () => void;
    state: BoolOrUnset;
};

export default function FilterToggleItem({
    title,
    onPress,
    state,
}: FilterToggleItemProps) {
    const radioButtonStyle = useMemo<ViewStyle>(() => {
        const BORDER_WIDTH = 1;

        if (state === true) {
            return {
                backgroundColor: '#16A34A',
                borderWidth: 0,
                width: styles.radioButton.width + BORDER_WIDTH,
                height: styles.radioButton.height + BORDER_WIDTH,
            };
        } else if (state === false) {
            return {
                backgroundColor: '#dc2626',
                borderWidth: 0,
                width: styles.radioButton.width + BORDER_WIDTH,
                height: styles.radioButton.height + BORDER_WIDTH,
            };
        }

        return {
            borderColor: '#D8D4D5',
            borderWidth: BORDER_WIDTH,
        };
    }, [state]);

    const radioButtonIcon = useMemo(() => {
        const ICON_SIZE = 14;

        if (state === true) {
            return (
                <Ionicons name="checkmark" color="#D8D4D5" size={ICON_SIZE} />
            );
        } else if (state === false) {
            return <Feather name="x" color="#D8D4D5" size={ICON_SIZE} />;
        }
    }, [state]);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={[styles.radioButton, radioButtonStyle]}>
                {radioButtonIcon}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        justifyContent: 'space-between',
    },
    radioButton: {
        width: 23,
        height: 23,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.6,
        fontWeight: '300',
    },
});
