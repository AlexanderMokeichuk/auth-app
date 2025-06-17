import { prisma } from '../config/database';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { RegisterRequest, LoginRequest, AuthResponse, UserResponse } from '../types';
import { AppError } from '../middleware/errorHandler';

export class UserService {
    static async register(data: RegisterRequest): Promise<AuthResponse> {
        const { email, password } = data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new AppError('Email уже зарегистрирован', 400);
        }

        const passwordHash = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
            },
        });

        const token = generateToken({
            userId: user.id,
            email: user.email,
        });

        return { token };
    }

    static async login(data: LoginRequest): Promise<AuthResponse> {
        const { email, password } = data;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError('Неверный email или пароль', 401);
        }

        const isPasswordValid = await comparePassword(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new AppError('Неверный email или пароль', 401);
        }

        const token = generateToken({
            userId: user.id,
            email: user.email,
        });

        return { token };
    }

    static async getUserById(userId: number): Promise<UserResponse> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
            },
        });

        if (!user) {
            throw new AppError('Пользователь не найден', 404);
        }

        return user;
    }
}
