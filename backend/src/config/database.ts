import { PrismaClient } from '@prisma/client';
import { config } from './config';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: config.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

if (config.nodeEnv !== 'production') globalForPrisma.prisma = prisma;

export const connectDB = async (): Promise<void> => {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

export const disconnectDB = async (): Promise<void> => {
    try {
        await prisma.$disconnect();
        console.log('✅ Database disconnected successfully');
    } catch (error) {
        console.error('❌ Database disconnection failed:', error);
    }
};