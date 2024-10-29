'use client';
import { User } from '@prisma/client';
import React, { createContext, useContext } from 'react';

const DefaultProps = { user: null };

export interface AuthContextType {
    user: User | null;
}

const AuthContext = createContext<AuthContextType>(DefaultProps);

export const AuthProvider: React.FC<{ children: React.ReactNode; user: User | null; }> = ({ children, user }) => {
    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
