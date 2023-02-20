import React, { useRef } from 'react';
// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, View } from 'react-native';
import HomeMap from '@/components/Maps/HomeMap';
import BottomBarAnimated from '@/components/Maps/BottomBar/BottomBarAnimated';
import BottomBarContent from '@/components/Maps/BottomBar/BottomBarContent';

export default function Home() {
    const BottomBarContainer = useRef<View>(null);

    return (
        <View style={styles.container}>
            {/* <StatusBar style="auto" /> */}
            <View style={styles.searchBarContainer}>
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor="#D1D5DB"
                    />
                </View>
            </View>
            <View style={styles.mapContainer}>
                <HomeMap />
            </View>
            <View style={styles.bottomBarContainer} ref={BottomBarContainer}>
                <BottomBarAnimated containerRef={BottomBarContainer}>
                    <BottomBarContent />
                </BottomBarAnimated>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        backgroundColor: 'transparent',
    },
    searchBarContainer: {
        position: 'absolute',
        top: 50,
        width: '100%',
        paddingHorizontal: 25,
        zIndex: 2,
        elevation: 2,
    },
    searchBar: {
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        paddingHorizontal: 10,
    },
    searchInput: { width: '100%', height: 48 },
    mapContainer: {
        flex: 1,
        width: '100%',
        zIndex: 1,
    },
    bottomBarContainer: {
        height: 72,
        width: '100%',
        zIndex: 9,
        overflow: 'visible',
        backgroundColor: 'transparent',
    },
});
