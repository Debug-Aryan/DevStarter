import React from 'react';
import { Pressable, ActivityIndicator, Text } from 'react-native';

export default function PrimaryButton({ onPress, title, disabled = false, loading = false }) {
    const isDisabled = disabled || loading;

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            className={`h-12 w-full flex-row items-center justify-center rounded-xl bg-blue-600 ${isDisabled ? 'opacity-60' : ''}`}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text className="text-base font-semibold text-white">{title}</Text>
            )}
        </Pressable>
    );
}
