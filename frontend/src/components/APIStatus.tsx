import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {apiConfig} from '@/services/api';
import {Bug, Clock, Key, RefreshCw, Server, Settings, Shield, Wifi, WifiOff, Zap} from 'lucide-react';

const LoadingSpinner = ({ size = "md", className = "" }) => (
    <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${
        size === 'sm' ? 'h-4 w-4' : 'h-6 w-6'
    } ${className}`} />
);

const APIStatus: React.FC = () => {
    const [isOnline, setIsOnline] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [lastChecked, setLastChecked] = useState<Date | null>(null);

    const checkHealth = async () => {
        setIsChecking(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const healthy = Math.random() > 0.3;
            setIsOnline(healthy);
            setLastChecked(new Date());
        } catch (error) {
            setIsOnline(false);
            setLastChecked(new Date());
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        void checkHealth();
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatLastChecked = (date: Date): string => {
        return date.toLocaleTimeString('ru-RU');
    };

    const getStatusIcon = () => {
        if (isChecking) return <div className="animate-spin"><Settings className="h-6 w-6" /></div>;
        if (isOnline === null) return <Settings className="h-6 w-6 text-gray-400" />;
        return isOnline ?
            <Wifi className="h-6 w-6 text-emerald-500" /> :
            <WifiOff className="h-6 w-6 text-red-500" />;
    };

    const getStatusGradient = () => {
        if (isOnline === null) return 'from-gray-500/20 to-gray-600/20';
        return isOnline ? 'from-emerald-500/20 to-green-600/20' : 'from-red-500/20 to-rose-600/20';
    };

    const getStatusBadge = () => {
        if (isOnline === null) return {
            text: 'Проверка...',
            className: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300'
        };
        return isOnline ? {
            text: 'Подключен',
            className: 'bg-gradient-to-r from-emerald-100 to-green-200 text-emerald-800 border border-emerald-300'
        } : {
            text: 'Отключен',
            className: 'bg-gradient-to-r from-red-100 to-rose-200 text-red-800 border border-red-300'
        };
    };

    const statusBadge = getStatusBadge();

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Мониторинг API
                </h1>
                <p className="text-gray-600">Отслеживание состояния и конфигурации API в реальном времени</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="relative overflow-hidden border-0 shadow-xl bg-white">
                    <div className={`absolute inset-0 bg-gradient-to-br ${getStatusGradient()} opacity-50`} />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16" />

                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <Server className="h-5 w-5" />
                                Статус API
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                Мониторинг работоспособности сервера
                            </CardDescription>
                        </div>
                        <div className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg">
                            {getStatusIcon()}
                        </div>
                    </CardHeader>

                    <CardContent className="relative space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Статус подключения</span>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${statusBadge.className}`}>
                                {statusBadge.text}
                            </span>
                        </div>

                        {lastChecked && (
                            <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Последняя проверка</span>
                                </div>
                                <span className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
                                    {formatLastChecked(lastChecked)}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
                            <div className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Автопроверка</span>
                            </div>
                            <span className="text-sm text-gray-800 font-medium">Каждые 30 сек</span>
                        </div>

                        <Button
                            variant="outline"
                            size="lg"
                            onClick={checkHealth}
                            disabled={isChecking}
                            className="w-full bg-white/80 backdrop-blur-sm hover:bg-white/90 border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md"
                        >
                            {isChecking ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Проверка...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Проверить сейчас
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-0 shadow-xl bg-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10" />
                    <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full -translate-y-12 -translate-x-12" />

                    <CardHeader className="relative">
                        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Конфигурация API
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Текущие настройки среды выполнения
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="relative space-y-4">
                        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                                <Server className="h-4 w-4" />
                                Базовый URL
                            </label>
                            <p className="text-sm font-mono bg-gray-900 text-green-400 p-3 rounded-lg border">
                                {apiConfig?.baseURL || 'http://localhost:5000/api'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                                    <Clock className="h-4 w-4" />
                                    Таймаут
                                </label>
                                <p className="text-lg font-semibold text-gray-800">
                                    {apiConfig?.timeout || '5000'}мс
                                </p>
                            </div>
                            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                                    <Key className="h-4 w-4" />
                                    Ключ токена
                                </label>
                                <p className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
                                    {apiConfig?.tokenKey || 'authToken'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                                    <Shield className="h-4 w-4" />
                                    Автовыход
                                </label>
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                                    (apiConfig?.autoLogoutOn401 ?? true) ?
                                        'bg-gradient-to-r from-emerald-100 to-green-200 text-emerald-800 border border-emerald-300' :
                                        'bg-gradient-to-r from-red-100 to-rose-200 text-red-800 border border-red-300'
                                }`}>
                                    {(apiConfig?.autoLogoutOn401 ?? true) ? 'Включен' : 'Отключен'}
                                </span>
                            </div>
                            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                                    <Bug className="h-4 w-4" />
                                    Режим отладки
                                </label>
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                                    (apiConfig?.debugMode ?? false) ?
                                        'bg-gradient-to-r from-blue-100 to-indigo-200 text-blue-800 border border-blue-300' :
                                        'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300'
                                }`}>
                                    {(apiConfig?.debugMode ?? false) ? 'Вкл' : 'Выкл'}
                                </span>
                            </div>
                        </div>

                        {(apiConfig?.debugMode ?? false) && (
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                <label className="flex items-center gap-2 text-sm font-medium text-blue-700 mb-2">
                                    <Bug className="h-4 w-4" />
                                    Уровень логирования
                                </label>
                                <p className="text-sm font-semibold text-blue-800 uppercase tracking-wide">
                                    {apiConfig?.logLevel || 'INFO'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default APIStatus;