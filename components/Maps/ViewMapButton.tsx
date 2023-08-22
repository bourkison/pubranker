import React, { MutableRefObject, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '@/store/hooks';
import { setState } from '@/store/slices/explore';
import Animated, {
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';
import { COLLAPSE_MAP_BUTTON_TIMEOUT, MIN_MAP_BUTTON_WIDTH } from '@/constants';

type ViewMapButtonProps = {
    expand: () => void;
    collapse: () => void;
    animatedWidth: SharedValue<number>;
    expandTimeout: MutableRefObject<NodeJS.Timeout | undefined>;
};

export default function ViewMapButton({
    expand,
    collapse,
    animatedWidth,
    expandTimeout,
}: ViewMapButtonProps) {
    const dispatch = useAppDispatch();

    const rStyle = useAnimatedStyle(() => ({
        width: animatedWidth.value,
    }));

    useEffect(() => {
        expand();

        expandTimeout.current = setTimeout(() => {
            collapse();
        }, COLLAPSE_MAP_BUTTON_TIMEOUT);

        return () => {
            collapse();
            clearTimeout(expandTimeout.current);
        };
    }, [expand, collapse, expandTimeout]);

    const openMap = () => {
        // TODO: Load pubs in if no pubs loaded in yet.
        dispatch(setState('map'));
    };

    return (
        <Animated.View style={[rStyle, styles.container]}>
            <Pressable onPress={openMap} style={styles.pressableContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Map</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Ionicons name="map-outline" size={18} color="#FFF" />
                </View>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#384D48',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.4,
        overflow: 'hidden',
        height: MIN_MAP_BUTTON_WIDTH,
    },
    pressableContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
    },
    textContainer: {
        marginLeft: 2,
    },
    text: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
