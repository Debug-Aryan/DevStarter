import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // Placeholder logic - connect to real backend
    const login = async (email, password) => {
        console.log('Login attempt:', email);
        // Simulate API call
        setUser({ email, token: 'fake-jwt-token' });
    };

    const register = async (email, password) => {
        console.log('Register attempt:', email);
        // Simulate API call
        setUser({ email, token: 'fake-jwt-token' });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
