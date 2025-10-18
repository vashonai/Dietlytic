import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, AuthState } from '../services/authService';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>(authService.getAuthState());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('AuthContext - Initializing auth state');
        console.log('AuthContext - Initial auth state:', authState);

        // Simulate initial auth check
        const checkAuthState = async () => {
            try {
                // Small delay to ensure proper initialization
                await new Promise(resolve => setTimeout(resolve, 100));
                console.log('AuthContext - Setting loading to false');
                setIsLoading(false);
            } catch (error) {
                console.error('Auth initialization error:', error);
                setIsLoading(false);
            }
        };

        checkAuthState();

        // Subscribe to auth state changes
        const unsubscribe = authService.addAuthListener((newState) => {
            console.log('AuthContext - Auth state changed:', newState);
            setAuthState(newState);
        });

        return unsubscribe;
    }, []);

    const login = async (email: string, password: string) => {
        return await authService.login(email, password);
    };

    const logout = async () => {
        await authService.logout();
    };

    const value: AuthContextType = {
        ...authState,
        login,
        logout,
        isLoading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
