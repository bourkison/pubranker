import { supabase } from '@/services/supabase';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Text,
} from 'react-native';

type SignUpModalProps = {
    visible: boolean;
    setVisible: (visible: boolean) => void;
};

export default function SignUpModal({ visible, setVisible }: SignUpModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signUp = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        console.log('RESPONSE:', data, error);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <Pressable
                style={styles.pressableContainer}
                onPress={() => setVisible(false)}>
                <View style={styles.modalContainer}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Email"
                        placeholderTextColor="#A3A3A3"
                        value={email}
                        returnKeyType="search"
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect={false}
                    />
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Password"
                        secureTextEntry={true}
                        placeholderTextColor="#A3A3A3"
                        value={password}
                        returnKeyType="search"
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <TouchableOpacity
                        style={styles.signUpButton}
                        onPress={signUp}>
                        <Text style={styles.signUpButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    pressableContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    modalContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 5,
        paddingVertical: 25,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBar: {
        width: '100%',
        borderRadius: 7,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginHorizontal: 15,
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center',
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
});
