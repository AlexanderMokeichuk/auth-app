export interface AuthResponse {
    token: string;
}

export interface UserResponse {
    id: number;
    email: string;
}

export interface ErrorResponse {
    error: string;
    details?: Record<string, string>;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface User {
    id: number;
    email: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export interface ApiError {
    message: string;
    details?: Record<string, string>;
}