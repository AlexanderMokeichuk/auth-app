import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: 'Слишком много запросов. Попробуйте позже.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        error: 'Слишком много попыток входа. Повторите позже.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
