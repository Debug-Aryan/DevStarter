import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
    const { register, isAuthLoading, authError, clearError } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function onSubmit() {
        clearError();
        await register({ name: name.trim(), email: email.trim(), password });
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View className="flex-1 items-center justify-center px-6">
                <View className="w-full max-w-md">
                    <Text className="text-3xl font-bold text-gray-900">Create account</Text>
                    <Text className="mt-2 text-base text-gray-600">Get started in seconds.</Text>

                    <View className="mt-8">
                        <View>
                            <Text className="mb-2 text-sm font-medium text-gray-700">Name</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="Your name"
                                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900"
                            />
                        </View>

                        <View className="mt-4">
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
                                placeholder="Create a password"
                                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900"
                            />
                        </View>

                        {authError ? (
                            <Text className="mt-4 text-sm text-red-600">{authError}</Text>
                        ) : null}

                        <View className="mt-4">
                            <PrimaryButton
                                title="Create account"
                                onPress={onSubmit}
                                loading={isAuthLoading}
                            />
                        </View>

                        <Text
                            onPress={() => {
                                clearError();
                                navigation.navigate('Login');
                            }}
                            className="mt-4 text-center text-sm text-gray-600"
                        >
                            Already have an account?{' '}
                            <Text className="font-semibold text-blue-600">Login</Text>
                        </Text>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
