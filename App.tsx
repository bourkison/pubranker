import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import Navigator from '@/nav/MainNavigator';
import AuthContainer from '@/components/Auth/AuthContainer';
import { Provider } from 'react-redux';
import store from '@/store';

import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { LogBox, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import CollectionProvider from '@/components/Collections/CollectionProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MapBox from '@rnmapbox/maps';

MapBox.setAccessToken(
    'pk.eyJ1IjoiaGFycmlzb25ib3Vya2UiLCJhIjoiY203ZzluMHM1MHl0aDJpcjB1cnBhNWkydyJ9.9QqjbSyBDwFw0gmseVokDQ',
);

dayjs.extend(advancedFormat);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s',
        s: '%ds',
        m: '1m',
        mm: '%dm',
        h: '1h',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1mo',
        MM: '%dmo',
        y: '1y',
        yy: '%dy',
    },
});

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

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
