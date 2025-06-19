import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, LogIn, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Неверный формат email'),
    password: z.string().min(1, 'Пароль обязателен'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
    const { login, isAuthenticated, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Загрузка...</p>
                </div>
            </div>
        );
    }

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsSubmitting(true);
            await login(data.email, data.password);
        } catch {
            //
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/30 to-blue-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-yellow-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 shadow-2xl shadow-blue-500/25 mb-8">
                        <LogIn className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                        Войдите в свой аккаунт
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Или{' '}
                        <Link
                            to="/register"
                            className="font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text hover:from-blue-700 hover:to-purple-700 transition-all duration-200 inline-flex items-center gap-1"
                        >
                            создайте новый аккаунт
                            <ArrowRight className="h-4 w-4 text-blue-600" />
                        </Link>
                    </p>
                </div>

                <Card className="bg-white/80 backdrop-blur-xl shadow-2xl border-0 rounded-2xl overflow-hidden">
                    <CardHeader className="space-y-1 bg-gradient-to-br from-blue-50/50 to-purple-50/50 pb-8">
                        <CardTitle className="text-2xl text-center font-bold text-gray-800 flex items-center justify-center gap-2">
                            <Sparkles className="h-6 w-6 text-blue-600" />
                            Добро пожаловать
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600 text-base">
                            Введите данные для доступа к аккаунту
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-blue-600" />
                                    Адрес электронной почты
                                </Label>
                                <div className="relative group">
                                    <Input
                                        {...register('email')}
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="username email"
                                        placeholder="Введите ваш email"
                                        className={`pl-4 pr-4 py-3 text-base rounded-xl border-2 transition-all duration-200 bg-gray-50/50 backdrop-blur-sm ${
                                            errors.email
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 group-hover:border-gray-300'
                                        } focus:bg-white`}
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-200 pointer-events-none"></div>
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <span className="text-red-500">⚠</span>
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-blue-600" />
                                    Пароль
                                </Label>
                                <div className="relative group">
                                    <Input
                                        {...register('password')}
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        placeholder="Введите ваш пароль"
                                        className={`pl-4 pr-12 py-3 text-base rounded-xl border-2 transition-all duration-200 bg-gray-50/50 backdrop-blur-sm ${
                                            errors.password
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 group-hover:border-gray-300'
                                        } focus:bg-white`}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-lg transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-500" />
                                        )}
                                    </Button>
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-200 pointer-events-none"></div>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <span className="text-red-500">⚠</span>
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:hover:shadow-blue-500/25"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <LoadingSpinner size="sm" className="text-white" />
                                        <span>Вход в систему...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <span>Войти</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                )}
                            </Button>

                            <input type="hidden" name="login-form" value="true" />
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-gray-500">
                    Нажимая "Войти", вы соглашаетесь с условиями использования
                </p>
            </div>
        </div>
    );
};

export default Login;