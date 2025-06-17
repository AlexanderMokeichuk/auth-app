import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { registerSchema, loginSchema } from '../types';

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData = registerSchema.parse(req.body);
            const result = await UserService.register(validatedData);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData = loginSchema.parse(req.body);
            const result = await UserService.login(validatedData);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                return next(new Error('Пользователь не авторизован'));
            }

            const user = await UserService.getUserById(req.user.userId);

            res.status(200).json({ user });
        } catch (error) {
            next(error);
        }
    }
}