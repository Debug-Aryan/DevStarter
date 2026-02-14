import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const { login, isAuthLoading, authError, clearError } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function onSubmit() {
        clearError();
        await login({ email: email.trim(), password });
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View className="flex-1 items-center justify-center px-6">
                <View className="w-full max-w-md">
                    <Text className="text-3xl font-bold text-gray-900">Welcome back</Text>
                    <Text className="mt-2 text-base text-gray-600">Sign in to continue.</Text>

                    <View className="mt-8">
                        <View>
                            <Text className="mb-2 text-sm font-medium text-gray-700">Email</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                placeholder="you@example.com"
                                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900"
                            />
                        </View>

                        <View className="mt-4">
                            <Text className="mb-2 text-sm font-medium text-gray-700">Password</Text>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholder="••••••••"
                                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900"
                            />
                        </View>

                        {authError ? (
                            <Text className="mt-4 text-sm text-red-600">{authError}</Text>
                        ) : null}

                        <View className="mt-4">
                            <PrimaryButton title="Login" onPress={onSubmit} loading={isAuthLoading} />
                        </View>

                        <Text
                            onPress={() => {
                                clearError();
                                navigation.navigate('Register');
                            }}
                            className="mt-4 text-center text-sm text-gray-600"
                        >
                            Don’t have an account?{' '}
                            <Text className="font-semibold text-blue-600">Create one</Text>
                        </Text>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
