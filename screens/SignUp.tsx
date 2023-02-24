import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

export default function SignUp() {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Sign Up</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});
