import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as turf from '@turf/turf';
import { Color } from '@/types';

type GroupMapMarkerProps = {
    group: { location: turf.helpers.Point; pubId: number }[];
    width: number;
    borderSize: number;
    circleColor: Color;
    outlineColor: Color;
    numberColor: Color;
};

export default function GroupMapMarker({
    group,
    width,
    circleColor,
    outlineColor,
    numberColor,
    borderSize,
}: GroupMapMarkerProps) {
    return (
        <View
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
        </View>
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
