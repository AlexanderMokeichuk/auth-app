import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {config} from '../config/config';
import {JWTPayload} from '../types';

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, config.bcryptRounds);
};

export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
};

export const verifyToken = (token: string): JWTPayload => {
    return jwt.verify(token, config.jwt.secret) as JWTPayload;
};