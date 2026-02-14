import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import RootNavigator from './navigation/RootNavigator';
import { AuthProvider } from './context/AuthContext';

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <StatusBar style="dark" />
                <RootNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
}
