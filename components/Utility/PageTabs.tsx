import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type PageTabsProps = {
    pages: {
        title: string;
        page: JSX.Element;
    }[];
};

export default function PageTabs({ pages }: PageTabsProps) {
    const selectedPage = useState(0);

    return (
        <View style={styles.container}>
            <View style={styles.tabsContainer}>
                {pages.map(page => (
                    <View style={styles.tabContainer}>
                        <Text>{page.title}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tabContainer: {
        flex: 1,
    },
});
