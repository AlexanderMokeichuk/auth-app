import {Request, Response, NextFunction} from 'express';
import {verifyToken} from '../utils/auth';
import {AppError} from './errorHandler';

export const authenticate = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Токен не предоставлен', 401);
        }

        const token = authHeader.substring(7);
        const payload = verifyToken(token);

        req.user = payload;
        next();
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            next(new AppError('Недействительный токен', 401));
        }
    }
};