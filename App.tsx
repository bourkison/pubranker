import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import Navigator from '@/nav/MainNavigator';
import AuthContainer from '@/components/Auth/AuthContainer';
import { Provider } from 'react-redux';
import store from '@/store';

import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

export default function App() {
    const [fontsLoaded] = useFonts({
        Jost: require('@/assets/fonts/Jost-Regular.ttf'),
        JostLight: require('@/assets/fonts/Jost-Light.ttf'),
    });

    useEffect(() => {
        console.log('Fonts loaded:', fontsLoaded);
    }, [fontsLoaded]);

    return (
        <GestureHandlerRootView style={styles.flexOne}>
            <Provider store={store}>
                <NavigationContainer>
                    <AuthContainer>
                        <ActionSheetProvider>
                            <Navigator />
                        </ActionSheetProvider>
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
