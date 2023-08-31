import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';
import { Color } from '@/types';

type PubMapMarkerProps = {
    width: number;
    pinColor: Color;
    dotColor: Color;
    outlineColor: Color;
};

export default function PubMapMarker({
    width,
    dotColor,
    outlineColor,
    pinColor,
}: PubMapMarkerProps) {
    return (
        <View style={[styles.container, { width }]}>
            <Svg width="100%" height="100%" viewBox="0 0 207 263" fill="none">
                <Rect x="48" y="56" width="109" height="115" fill={dotColor} />
                <Path
                    d="M103.231 0C46.2185 0 0 46.2185 0 103.231C0 128.684 9.25362 151.945 24.5246 169.944L103.231 262.638L181.935 169.941C197.206 151.945 206.46 128.681 206.46 103.228C206.463 46.2185 160.244 0 103.231 0ZM103.231 142.131C79.7837 142.131 60.7774 123.125 60.7774 99.677C60.7774 76.2292 79.7837 57.223 103.231 57.223C126.679 57.223 145.685 76.2292 145.685 99.677C145.685 123.125 126.679 142.131 103.231 142.131Z"
                    fill={outlineColor}
                />
                <Path
                    d="M103.404 5C48.5048 5 4 49.5048 4 104.404C4 128.913 12.9105 151.311 27.6152 168.643L103.404 257.9L179.189 168.64C193.894 151.311 202.805 128.91 202.805 104.401C202.807 49.5048 158.303 5 103.404 5ZM103.404 141.861C80.8254 141.861 62.5239 123.56 62.5239 100.981C62.5239 78.4028 80.8254 60.1013 103.404 60.1013C125.982 60.1013 144.284 78.4028 144.284 100.981C144.284 123.56 125.982 141.861 103.404 141.861Z"
                    fill={pinColor}
                />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        aspectRatio: 1,
    },
});
