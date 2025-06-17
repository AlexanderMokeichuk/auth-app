import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, User, ApiError } from '@/types';
import { authAPI } from '@/services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user && !!token;

    useEffect(() => {
        const verifyToken = async () => {
            if (token) {
                try {
                    const userData = await authAPI.verifyToken();
                    setUser(userData);
                } catch (error) {
                    localStorage.removeItem('auth_token');
                    setToken(null);
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        void verifyToken();
    }, [token]);

    const login = async (email: string, password: string): Promise<void> => {
        try {
            setIsLoading(true);
            const newToken = await authAPI.login(email, password);

            localStorage.setItem('auth_token', newToken);
            setToken(newToken);

            const userData = await authAPI.verifyToken();
            setUser(userData);

            toast.success('Успешный вход!');
        } catch (error) {
            const apiError = error as ApiError;
            toast.error(apiError.message || 'Ошибка входа');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string): Promise<void> => {
        try {
            setIsLoading(true);
            const newToken = await authAPI.register(email, password);

            localStorage.setItem('auth_token', newToken);
            setToken(newToken);

            const userData = await authAPI.verifyToken();
            setUser(userData);

            toast.success('Регистрация прошла успешно!');
        } catch (error) {
            const apiError = error as ApiError;
            toast.error(apiError.message || 'Ошибка регистрации');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = (): void => {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
        toast.success('Вы успешно вышли!');
    };

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }
    return context;
};
