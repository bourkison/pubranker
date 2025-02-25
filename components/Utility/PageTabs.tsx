import { PRIMARY_COLOR } from '@/constants';
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
    const [overlayHeight, setOverlayHeight] = useState(0);
    const [overlayWidth, setOverlayWidth] = useState(0);

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View
                    style={styles.tabsContainer}
                    onLayout={({
                        nativeEvent: {
                            layout: { height, width },
                        },
                    }) => {
                        if (overlayHeight === 0) {
                            setOverlayHeight(height);
                        }

                        if (overlayWidth === 0) {
                            setOverlayWidth(width / pages.length);
                        }
                    }}>
                    {pages.map((page, index) => (
                        <Pressable
                            style={styles.tabContainer}
                            key={index}
                            onPress={() => setSelectedPage(index)}>
                            <Text
                                style={[
                                    styles.pageText,
                                    selectedPage === index
                                        ? styles.selectedPageText
                                        : undefined,
                                ]}>
                                {page.title}
                            </Text>
                        </Pressable>
                    ))}

                    <View
                        style={[
                            styles.overlay,
                            { height: overlayHeight, width: overlayWidth },
                        ]}
                    />
                </View>
            </View>

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
    overlay: {
        backgroundColor: PRIMARY_COLOR,
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        borderRadius: 10,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        borderRadius: 10,
    },
    tabContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
    },
    pageText: {
        color: 'rgba(1, 1, 1, 0.5)',
        fontWeight: '600',
        fontSize: 12,
        zIndex: 99,
    },
    selectedPageText: {
        color: '#fff',
    },
    pageContainer: {
        flex: 1,
        flexDirection: 'row',
    },
});
