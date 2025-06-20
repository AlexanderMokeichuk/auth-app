import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import type { AuthResponse, UserResponse, ErrorResponse, ApiError } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://auth-app-2lxd.onrender.com/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'auth_token';
const AUTO_LOGOUT_ON_401 = import.meta.env.VITE_AUTO_LOGOUT_ON_401 === 'true';
const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';

const ERROR_MESSAGES = {
    UNEXPECTED_ERROR: 'Произошла неожиданная ошибка',
    ACCESS_FORBIDDEN: 'Доступ запрещен - недостаточно прав',
    RESOURCE_NOT_FOUND: 'Ресурс не найден',
    VALIDATION_ERROR: 'Ошибка валидации данных',
    TOO_MANY_REQUESTS: 'Слишком много запросов - попробуйте позже',
    SERVER_ERROR: 'Ошибка сервера - попробуйте позже',
    NETWORK_ERROR: 'Ошибка сети - проверьте подключение к интернету',
} as const;

const log = {
    error: (message: string, error?: any) => {
        if (DEBUG_MODE) {
            console.error(`[API] ${message}`, error);
        }
    }
};

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    log.error('Ошибка перехватчика запроса', error);
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError<ErrorResponse>) => {
        const { response, request } = error;

        if (DEBUG_MODE) {
            log.error(`Ошибка API запроса`, {
                status: response?.status,
                url: error.config?.url,
                data: response?.data,
            });
        }

        const apiError: ApiError = {
            message: response?.data?.error || error.message || ERROR_MESSAGES.UNEXPECTED_ERROR,
            details: response?.data?.details,
        };

        if (response?.status === 401 && AUTO_LOGOUT_ON_401) {
            localStorage.removeItem(TOKEN_KEY);
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        } else if (response?.status === 403) {
            apiError.message = ERROR_MESSAGES.ACCESS_FORBIDDEN;
        } else if (response?.status === 404) {
            apiError.message = ERROR_MESSAGES.RESOURCE_NOT_FOUND;
        } else if (response?.status === 422) {
            apiError.message = ERROR_MESSAGES.VALIDATION_ERROR;
        } else if (response?.status === 429) {
            apiError.message = ERROR_MESSAGES.TOO_MANY_REQUESTS;
        } else if (response?.status && response.status >= 500) {
            apiError.message = ERROR_MESSAGES.SERVER_ERROR;
        } else if (!response && request) {
            apiError.message = ERROR_MESSAGES.NETWORK_ERROR;
        }

        return Promise.reject(apiError);
    }
);

export const tokenUtils = {
    get: (): string | null => localStorage.getItem(TOKEN_KEY),

    set: (token: string): void => {
        localStorage.setItem(TOKEN_KEY, token);
    },

    remove: (): void => {
        localStorage.removeItem(TOKEN_KEY);
    },

    isValid: (): boolean => {
        const token = localStorage.getItem(TOKEN_KEY);
        return !!token;
    }
};

export const checkAPIHealth = async (): Promise<boolean> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
        return response.status === 200;
    } catch (error) {
        return false;
    }
};

export const authAPI = {
    login: async (email: string, password: string): Promise<string> => {
        const response = await api.post<AuthResponse>('/user/auth', { email, password });
        const token = response.data.token;
        tokenUtils.set(token);
        return token;
    },

    register: async (email: string, password: string): Promise<string> => {
        const response = await api.post<AuthResponse>('/user', { email, password });
        const token = response.data.token;
        tokenUtils.set(token);
        return token;
    },

    verifyToken: async (): Promise<UserResponse> => {
        const response = await api.get<{ user: UserResponse }>('/user/verify');
        return response.data.user;
    },

    logout: (): void => {
        tokenUtils.remove();
    }
};

export const healthAPI = {
    check: async (): Promise<any> => {
        const response = await api.get('/health');
        return response.data;
    },
};

export const apiConfig = {
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    tokenKey: TOKEN_KEY,
    autoLogoutOn401: AUTO_LOGOUT_ON_401,
    debugMode: DEBUG_MODE,
    logLevel: 'error',
};

export default api;