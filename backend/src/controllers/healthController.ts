import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class HealthController {
    static async check(_req: Request, res: Response): Promise<void> {
        try {
            await prisma.$queryRaw`SELECT 1`;

            res.status(200).json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                database: 'connected',
            });
        } catch (error) {
            res.status(503).json({
                status: 'ERROR',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                database: 'disconnected',
                error: 'Database connection failed',
            });
        }
    }
}