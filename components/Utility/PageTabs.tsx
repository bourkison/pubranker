import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type PageTabsProps = {
    pages: {
        title: string;
        component: JSX.Element;
    }[];
};

export default function PageTabs({ pages }: PageTabsProps) {
    const [selectedPage, setSelectedPage] = useState(0);

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.tabsContainer}>
                    {pages.map((page, index) => (
                        <Pressable
                            style={styles.tabContainer}
                            key={index}
                            onPress={() => setSelectedPage(index)}>
                            <Text style={styles.pageText}>{page.title}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>
            {/* <View style={styles.tabsContainer}>
                {pages.map((page, index) => (
                    <Pressable
                        style={styles.tabContainer}
                        key={index}
                        onPress={() => setSelectedPage(index)}>
                        <Text style={styles.pageText}>{page.title}</Text>
                    </Pressable>
                ))}
            </View> */}

            <View style={styles.pageContainer}>
                {pages[selectedPage].component}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    topContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: '100%',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        borderRadius: 10,
    },
    tabContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageText: {
        color: 'rgba(1, 1, 1, 0.5)',
        fontWeight: '600',
        fontSize: 12,
    },
    pageContainer: {
        flex: 1,
        flexDirection: 'row',
    },
});
