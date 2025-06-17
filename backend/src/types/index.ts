import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Неверный формат email'),
    password: z
        .string()
        .min(8, 'Пароль должен быть от 8 символов')
        .regex(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Пароль должен содержать буквы, цифры и спецсимвол'
        ),
});

export const loginSchema = z.object({
    email: z.string().email('Неверный формат email'),
    password: z.string().min(1, 'Пароль обязателен'),
});


export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;

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

export interface JWTPayload {
    userId: number;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}