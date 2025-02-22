import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Color } from '@/types';
import { Point } from '@turf/helpers';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';

type GroupMapMarkerProps = {
    group: { location: Point; pubId: number }[];
    width: number;
    borderSize: number;
    circleColor: Color;
    outlineColor: Color;
    numberColor: Color;
    onPress?: (locations: Position[]) => void;
};

export default function GroupMapMarker({
    group,
    width,
    circleColor,
    outlineColor,
    numberColor,
    borderSize,
    onPress,
}: GroupMapMarkerProps) {
    return (
        <Pressable
            onPress={() =>
                onPress && onPress(group.map(p => p.location.coordinates))
            }
            style={[
                styles.container,
                {
                    width: width,
                    height: width,
                    borderRadius: width / 2,
                    backgroundColor: circleColor,
                    borderWidth: borderSize,
                    borderColor: outlineColor,
                },
            ]}>
            <Text style={[styles.text, { color: numberColor }]}>
                {group.length}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontWeight: '800',
    },
});
