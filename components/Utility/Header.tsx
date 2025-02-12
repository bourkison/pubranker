import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
} from 'react-native';

type HeaderProps = {
    header: string | JSX.Element;
    leftColumn?: string | JSX.Element;
    rightColumn?: string | JSX.Element;
    containerStyle?: StyleProp<ViewStyle>;
    leftColumnContainerStyle?: StyleProp<ViewStyle>;
    leftColumnTextStyle?: StyleProp<TextStyle>;
    rightColumnContainerStyle?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
    rightColumnTextStyle?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
    headerContainerStyle?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
    headerTextStyle?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
};

export default function Header({
    leftColumn,
    header,
    rightColumn,
    leftColumnContainerStyle,
    leftColumnTextStyle,
    headerContainerStyle,
    headerTextStyle,
    rightColumnContainerStyle,
    rightColumnTextStyle,
}: HeaderProps) {
    return (
        <View style={styles.container}>
            {typeof leftColumn === 'string' ? (
                <View
                    style={[
                        styles.leftColumnContainer,
                        leftColumnContainerStyle,
                    ]}>
                    <Text style={[styles.leftColumnText, leftColumnTextStyle]}>
                        {leftColumn}
                    </Text>
                </View>
            ) : leftColumn === undefined ? (
                <View />
            ) : (
                leftColumn
            )}

            {typeof header === 'string' ? (
                <View style={[styles.headerContainer, headerContainerStyle]}>
                    <Text style={[styles.headerText, headerTextStyle]}>
                        {header}
                    </Text>
                </View>
            ) : (
                header
            )}

            {typeof rightColumn === 'string' ? (
                <View
                    style={[
                        styles.rightColumnContainer,
                        rightColumnContainerStyle,
                    ]}>
                    <Text
                        style={[styles.rightColumnText, rightColumnTextStyle]}>
                        {rightColumn}
                    </Text>
                </View>
            ) : rightColumn === undefined ? (
                <View />
            ) : (
                rightColumn
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    leftColumnContainer: {},
    leftColumnText: {},
    headerContainer: {
        flex: 1,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Jost',
        textAlign: 'center',
    },
    rightColumnContainer: {},
    rightColumnText: {},
});
