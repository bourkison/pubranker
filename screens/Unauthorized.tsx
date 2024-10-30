import SignUpModal from '@/components/Auth/SignUpModal';
import LoginModal from '@/components/Auth/LoginModal';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';

type UnauthorizedProps = {
    type: 'saved';
};

export default function Unauthorized({ type }: UnauthorizedProps) {
    const [signUpModalVisible, setSignUpModalVisible] = useState(false);
    const [loginModalVisible, setLoginModalVisible] = useState(false);

    const test = useMemo(() => {
        switch (type) {
            case 'saved':
                return 'Create an account to save pubs!';
            default:
                return 'Error';
        }
    }, [type]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.hintText}>{test}</Text>
            <TouchableOpacity
                style={styles.signUpButton}
                onPress={() => setSignUpModalVisible(!signUpModalVisible)}>
                <Text style={styles.signUpButtonText}>Create Account</Text>
            </TouchableOpacity>
            <SignUpModal
                visible={signUpModalVisible}
                setVisible={setSignUpModalVisible}
            />

            <TouchableOpacity
                style={styles.loginButton}
                onPress={() => setLoginModalVisible(!loginModalVisible)}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <LoginModal
                visible={loginModalVisible}
                setVisible={setLoginModalVisible}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25,
    },
    hintText: {
        marginBottom: 10,
    },
    signUpButton: {
        backgroundColor: 'rgb(229, 130, 68)',
        paddingVertical: 5,
        width: '100%',
        maxWidth: 200,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    signUpButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    loginButton: {
        borderColor: 'rgb(229, 130, 68)',
        borderWidth: 1,
        paddingVertical: 5,
        width: '100%',
        maxWidth: 200,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButtonText: {
        color: 'rgb(229, 130, 68)',
        fontWeight: '600',
    },
});
