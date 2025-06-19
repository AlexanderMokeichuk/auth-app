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
import { Eye, EyeOff, UserPlus, Mail, Lock, CheckCircle, ArrowRight, Sparkles, Shield, ChevronDown, ChevronUp } from 'lucide-react';

const registerSchema = z.object({
    email: z.string().email('Неверный формат email'),
    password: z.string()
        .min(8, 'Пароль должен содержать минимум 8 символов')
        .regex(/[A-Z]/, 'Пароль должен содержать заглавную букву')
        .regex(/[a-z]/, 'Пароль должен содержать строчную букву')
        .regex(/[0-9]/, 'Пароль должен содержать цифру')
        .regex(/[^A-Za-z0-9]/, 'Пароль должен содержать специальный символ'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
    const { register: registerUser, isAuthenticated, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const password = watch('password') || '';

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

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setIsSubmitting(true);
            await registerUser(data.email, data.password);
        } catch {
            //
        } finally {
            setIsSubmitting(false);
        }
    };

    const passwordRequirements = [
        {
            label: 'Минимум 8 символов',
            met: password.length >= 8,
        },
        {
            label: 'Заглавная буква',
            met: /[A-Z]/.test(password),
        },
        {
            label: 'Строчная буква',
            met: /[a-z]/.test(password),
        },
        {
            label: 'Цифра',
            met: /[0-9]/.test(password),
        },
        {
            label: 'Специальный символ',
            met: /[^A-Za-z0-9]/.test(password),
        },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="w-full max-w-lg space-y-8 relative z-10">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 shadow-2xl shadow-blue-500/25 mb-8">
                        <UserPlus className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                        Создайте аккаунт
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Или{' '}
                        <Link
                            to="/login"
                            className="font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text hover:from-blue-700 hover:to-purple-700 transition-all duration-200 inline-flex items-center gap-1"
                        >
                            войдите в существующий аккаунт
                            <ArrowRight className="h-4 w-4 text-blue-600" />
                        </Link>
                    </p>
                </div>

                <Card className="bg-white/80 backdrop-blur-xl shadow-2xl border-0 rounded-2xl overflow-hidden">
                    <CardHeader className="space-y-1 bg-gradient-to-br from-blue-50/50 to-purple-50/50 pb-8">
                        <CardTitle className="text-2xl text-center font-bold text-gray-800 flex items-center justify-center gap-2">
                            <Sparkles className="h-6 w-6 text-blue-600" />
                            Начните работу
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600 text-base">
                            Создайте новый аккаунт для доступа к платформе
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                                        autoComplete="email"
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
                                        autoComplete="new-password"
                                        placeholder="Создайте пароль"
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

                            <div className="space-y-3">
                                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-blue-600" />
                                    Подтвердите пароль
                                </Label>
                                <div className="relative group">
                                    <Input
                                        {...register('confirmPassword')}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        placeholder="Повторите ваш пароль"
                                        className={`pl-4 pr-12 py-3 text-base rounded-xl border-2 transition-all duration-200 bg-gray-50/50 backdrop-blur-sm ${
                                            errors.confirmPassword
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 group-hover:border-gray-300'
                                        } focus:bg-white`}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-lg transition-colors"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-500" />
                                        )}
                                    </Button>
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-200 pointer-events-none"></div>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <span className="text-red-500">⚠</span>
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordRequirements(!showPasswordRequirements)}
                                    className="w-full p-4 flex items-center justify-between text-left hover:bg-white/50 transition-colors duration-200"
                                >
                                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-blue-600" />
                                        Требования к паролю
                                    </h4>
                                    {showPasswordRequirements ? (
                                        <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                                    )}
                                </button>

                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                    showPasswordRequirements
                                        ? 'max-h-40 opacity-100'
                                        : 'max-h-0 opacity-0'
                                }`}>
                                    <div className="px-4 pb-4 border-t border-gray-200/50">
                                        <ul className="space-y-2 mt-3">
                                            {passwordRequirements.map((req, index) => (
                                                <li key={index} className="flex items-center gap-2 text-xs">
                                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 ${
                                                        req.met
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-200 text-gray-400'
                                                    }`}>
                                                        <CheckCircle className="w-3 h-3" />
                                                    </div>
                                                    <span className={`transition-colors duration-200 ${
                                                        req.met ? 'text-blue-700 font-medium' : 'text-gray-600'
                                                    }`}>
                                                        {req.label}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:hover:shadow-blue-500/25"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <LoadingSpinner size="sm" className="text-white" />
                                        <span>Создание аккаунта...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <span>Создать аккаунт</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                )}
                            </Button>

                            <input type="hidden" name="register-form" value="true" />
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-gray-500">
                    Создавая аккаунт, вы соглашаетесь с нашими условиями использования и политикой конфиденциальности
                </p>
            </div>
        </div>
    );
};

export default Register;