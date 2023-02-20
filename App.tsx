import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import Navigator from '@/nav/Navigator';
import { Provider } from 'react-redux';
import store from '@/store';

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Navigator />
            </NavigationContainer>
        </Provider>
    );
}
