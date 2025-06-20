import { z } from 'zod';

const configSchema = z.object({
    PORT: z.string().default('5000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default('24h'),
    BCRYPT_ROUNDS: z.string().default('12'),
    CORS_ORIGIN: z.string().default('https://auth-app-1-6xgh.onrender.com'),
});

const env = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
};

console.log('🔧 Loading environment configuration...');

const parsed = configSchema.safeParse(env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:');

    const errors = parsed.error.format();
    Object.entries(errors).forEach(([key, value]) => {
        if (key !== '_errors' && value && typeof value === 'object' && '_errors' in value) {
            console.error(`  • ${key}: ${value._errors.join(', ')}`);
        }
    });

    process.exit(1);
}

console.log('✅ Environment configuration loaded successfully');

if (parsed.data.NODE_ENV === 'development') {
    console.log('📋 Configuration summary:');
    console.log(`  • Environment: ${parsed.data.NODE_ENV}`);
    console.log(`  • Port: ${parsed.data.PORT}`);
    console.log(`  • CORS Origin: ${parsed.data.CORS_ORIGIN}`);
    console.log(`  • JWT Expires In: ${parsed.data.JWT_EXPIRES_IN}`);
    console.log(`  • BCrypt Rounds: ${parsed.data.BCRYPT_ROUNDS}`);
    console.log(`  • Database: ${parsed.data.DATABASE_URL.split('@')[1] || 'configured'}`);
    console.log(`  • JWT Secret: ${'*'.repeat(8)} (${parsed.data.JWT_SECRET.length} chars)`);
}

export const config = {
    port: parseInt(parsed.data.PORT),
    nodeEnv: parsed.data.NODE_ENV,
    databaseUrl: parsed.data.DATABASE_URL,
    jwt: {
        secret: parsed.data.JWT_SECRET,
        expiresIn: parsed.data.JWT_EXPIRES_IN,
    },
    bcryptRounds: parseInt(parsed.data.BCRYPT_ROUNDS),
    corsOrigin: parsed.data.CORS_ORIGIN,
};

console.log(`🚀 Application ready to start on port ${config.port}`);