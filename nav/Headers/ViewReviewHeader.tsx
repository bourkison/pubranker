import { StackHeaderProps } from '@react-navigation/stack';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { BottomSheetStackParamList } from '../BottomSheetNavigator';

export default function ViewReviewHeader({ options }: StackHeaderProps) {
    const route =
        useRoute<RouteProp<BottomSheetStackParamList, 'ViewReview'>>();

    return (
        <View style={styles.headerContainer}>
            <View style={styles.titleSubTitleContainer}>
                <Text style={styles.title}>{options.title}</Text>
                <Text style={styles.subtitle}>{route.params.pub.name}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        marginBottom: 5,
        justifyContent: 'space-between',
        shadowColor: 'rgb(0, 0, 0)',
        shadowOpacity: 1,
        paddingBottom: 10,
        elevation: 2,
        backgroundColor: 'white',
    },
    titleSubTitleContainer: {
        marginLeft: 10,
        flexDirection: 'column',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 12,
        color: '#A3A3A3',
    },
});
