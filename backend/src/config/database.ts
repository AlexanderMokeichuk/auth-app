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
        console.log('🔌 Testing database connection...');
        console.log('🔍 DATABASE_URL exists:', !!process.env.DATABASE_URL);

        await Promise.race([
            prisma.$connect(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Database connection timeout')), 15000)
            )
        ]);

        const userCount = await prisma.user.count();
        console.log('✅ Database connected successfully, users table accessible, count:', userCount);

    } catch (error) {
        console.error('❌ Database connection failed:', error);

        if (error.message.includes('does not exist')) {
            console.error('💡 Hint: Tables don\'t exist. Make sure "prisma db push" was executed during build');
        }

        throw error;
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