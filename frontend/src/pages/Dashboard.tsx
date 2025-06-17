import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { healthAPI } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import APIStatus from '@/components/APIStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Activity, Shield, Clock, LogOut } from 'lucide-react';

interface HealthStatus {
    status: string;
    timestamp: string;
    uptime: number;
    database: string;
}

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
    const [healthLoading, setHealthLoading] = useState(true);

    useEffect(() => {
        const fetchHealthStatus = async () => {
            try {
                const health = await healthAPI.check();
                setHealthStatus(health);
            } catch (error) {
            } finally {
                setHealthLoading(false);
            }
        };

        void fetchHealthStatus();
    }, []);

    const formatUptime = (uptime: number): string => {
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        return `${hours}ч ${minutes}м ${seconds}с`;
    };

    const formatDate = (timestamp: string): string => {
        return new Date(timestamp).toLocaleString('ru-RU');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center shadow-md">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Панель управления
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/60 backdrop-blur-sm rounded-full px-3 py-2 border border-gray-200 shadow-sm">
                                <User className="h-4 w-4" />
                                <span>{user?.email}</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={logout} className="bg-white/80 hover:bg-white border-gray-300 shadow-sm">
                                <LogOut className="h-4 w-4 mr-2" />
                                Выйти
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Добро пожаловать, {user?.email}!
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Вы успешно авторизованы и можете получить доступ к защищенным ресурсам.
                    </p>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Статус API и конфигурация</h3>
                    <APIStatus />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-semibold text-gray-800">Информация о пользователе</CardTitle>
                            <User className="h-5 w-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">ID пользователя</label>
                                    <p className="text-sm text-gray-900">{user?.id}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Email</label>
                                    <p className="text-sm text-gray-900">{user?.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Статус</label>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                        Аутентифицирован
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-semibold text-gray-800">Состояние API</CardTitle>
                            <Activity className="h-5 w-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            {healthLoading ? (
                                <div className="flex items-center justify-center py-4">
                                    <LoadingSpinner size="md" />
                                </div>
                            ) : healthStatus ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Статус</label>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                            healthStatus.status === 'OK'
                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                : 'bg-red-100 text-red-800 border-red-200'
                                        }`}>
                                            {healthStatus.status}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">База данных</label>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                            healthStatus.database === 'connected'
                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                : 'bg-red-100 text-red-800 border-red-200'
                                        }`}>
                                            {healthStatus.database === 'connected' ? 'Подключена' : healthStatus.database}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Время работы</label>
                                        <p className="text-sm text-gray-900">{formatUptime(healthStatus.uptime)}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-red-600">Не удалось загрузить статус системы</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-semibold text-gray-800">Информация о сессии</CardTitle>
                            <Clock className="h-5 w-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Время входа</label>
                                    <p className="text-sm text-gray-900">
                                        {formatDate(new Date().toISOString())}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Статус токена</label>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                        Действительный
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Безопасность</label>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                        Защищено JWT
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Доступные функции</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="text-center bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
                            <CardContent className="pt-6">
                                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <CardTitle className="text-sm font-semibold text-gray-800">Безопасная аутентификация</CardTitle>
                                <CardDescription className="text-xs text-gray-600 mt-1">Система авторизации на базе JWT</CardDescription>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
                            <CardContent className="pt-6">
                                <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <CardTitle className="text-sm font-semibold text-gray-800">Управление пользователями</CardTitle>
                                <CardDescription className="text-xs text-gray-600 mt-1">Профиль и настройки аккаунта</CardDescription>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
                            <CardContent className="pt-6">
                                <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <CardTitle className="text-sm font-semibold text-gray-800">Мониторинг API</CardTitle>
                                <CardDescription className="text-xs text-gray-600 mt-1">Проверки состояния в реальном времени</CardDescription>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
                            <CardContent className="pt-6">
                                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <CardTitle className="text-sm font-semibold text-gray-800">Управление сессиями</CardTitle>
                                <CardDescription className="text-xs text-gray-600 mt-1">Автоматическая обработка токенов</CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;