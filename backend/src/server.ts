import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/config';
import { connectDB, disconnectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import userRoutes from './routes/userRoutes';
import healthRoutes from './routes/healthRoutes';

const app = express();
app.set('trust proxy', true);

app.use(helmet());
app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
}));

app.use(rateLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRoutes);
app.use('/api/user', userRoutes);

app.use('*', (_req, res) => {
    res.status(404).json({
        error: 'Маршрут не найден',
    });
});

app.use(errorHandler);

const gracefulShutdown = async (signal: string) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);

    await disconnectDB();
    process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

const startServer = async () => {
    try {
        await connectDB();

        app.listen(config.port, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${config.port}`);
            console.log(`📱 Environment: ${config.nodeEnv}`);
            console.log(`🌐 CORS origin: ${config.corsOrigin}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

void startServer();