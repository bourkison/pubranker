import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, View } from 'react-native';
import HomeMap from '@/components/HomeMap';

export default function Home() {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.searchBarContainer}>
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor="#D1D5DB"
                    />
                </View>
            </View>
            <HomeMap />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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
});
