import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import Navigator from '@/nav/MainNavigator';
import AuthContainer from '@/components/Auth/AuthContainer';
import { Provider } from 'react-redux';
import store from '@/store';

import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import CollectionProvider from '@/components/Collections/CollectionProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

dayjs.extend(advancedFormat);

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
                        <BottomSheetModalProvider>
                            <ActionSheetProvider>
                                <SafeAreaProvider>
                                    <CollectionProvider>
                                        <View style={styles.flexOne}>
                                            <StatusBar style="dark" />
                                            <Navigator />
                                        </View>
                                    </CollectionProvider>
                                </SafeAreaProvider>
                            </ActionSheetProvider>
                        </BottomSheetModalProvider>
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
