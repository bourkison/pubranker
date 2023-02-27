import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import Navigator from '@/nav/Navigator';
import AuthContainer from '@/components/Auth/AuthContainer';
import { Provider } from 'react-redux';
import store from '@/store';

import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function App() {
    return (
        <GestureHandlerRootView style={styles.flexOne}>
            <Provider store={store}>
                <NavigationContainer>
                    <AuthContainer>
                        <Navigator />
                    </AuthContainer>
                </NavigationContainer>
            </Provider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    flexOne: {
        flex: 1,
    },
});
