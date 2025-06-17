import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { config } from '../config/config';

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    let statusCode = 500;
    let message = 'Ошибка сервера';
    let details: Record<string, string> | undefined;

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    } else if (error instanceof ZodError) {
        statusCode = 400;
        message = 'Ошибка валидации';
        details = error.errors.reduce((acc, err) => {
            const field = err.path.join('.');
            acc[field] = err.message;
            return acc;
        }, {} as Record<string, string>);
    } else if (error.message.includes('Уникальное ограничение')) {
        statusCode = 400;
        message = 'Email уже используется';
    }

    if (config.nodeEnv === 'development') {
        console.error('Ошибка:', error);
    }

    res.status(statusCode).json({
        error: message,
        ...(details && { details }),
    });
};
