import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiPost, setAuthToken } from '../services/api';

const TOKEN_STORAGE_KEY = '@devstarter/auth/token';

const AuthContext = createContext(null);

function getErrorMessage(error) {
    const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Something went wrong. Please try again.';

    return typeof message === 'string' ? message : 'Something went wrong. Please try again.';
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [isRestoringToken, setIsRestoringToken] = useState(true);
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function restoreToken() {
            try {
                const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
                if (!isMounted) return;

                if (storedToken) {
                    setAuthToken(storedToken);
                    setToken(storedToken);
                }
            } finally {
                if (isMounted) setIsRestoringToken(false);
            }
        }

        restoreToken();
        return () => {
            isMounted = false;
        };
    }, []);

    async function login({ email, password }) {
        setAuthError('');
        setIsAuthLoading(true);

        try {
            const response = await apiPost('/auth/login', { email, password });
            const responseToken = response?.data?.token;

            if (!responseToken) {
                throw new Error('Invalid login response (missing token).');
            }

            await AsyncStorage.setItem(TOKEN_STORAGE_KEY, responseToken);
            setAuthToken(responseToken);
            setToken(responseToken);
        } catch (error) {
            const message = getErrorMessage(error);
            setAuthError(message);
            throw error;
        } finally {
            setIsAuthLoading(false);
        }
    }

    async function register({ name, email, password }) {
        setAuthError('');
        setIsAuthLoading(true);

        try {
            const response = await apiPost('/auth/register', { name, email, password });
            const responseToken = response?.data?.token;

            if (!responseToken) {
                throw new Error('Invalid register response (missing token).');
            }

            await AsyncStorage.setItem(TOKEN_STORAGE_KEY, responseToken);
            setAuthToken(responseToken);
            setToken(responseToken);
        } catch (error) {
            const message = getErrorMessage(error);
            setAuthError(message);
            throw error;
        } finally {
            setIsAuthLoading(false);
        }
    }

    async function logout() {
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
        setAuthToken(null);
        setToken(null);
        setAuthError('');
    }

    function clearError() {
        setAuthError('');
    }

    const value = useMemo(
        () => ({
            token,
            isRestoringToken,
            isAuthLoading,
            authError,
            login,
            register,
            logout,
            clearError,
        }),
        [token, isRestoringToken, isAuthLoading, authError]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
}
