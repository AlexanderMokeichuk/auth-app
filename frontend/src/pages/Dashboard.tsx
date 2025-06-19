import React, {useState, useEffect} from 'react';
import {useAuth} from '@/context/AuthContext';
import {healthAPI} from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import APIStatus from '@/components/APIStatus';
import SoftwareList from '@/components/SoftwareList';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {User, Activity, Clock, LogOut} from 'lucide-react';

interface HealthStatus {
    status: string;
    timestamp: string;
    uptime: number;
    database: string;
}

const Dashboard: React.FC = () => {
    const {user, logout} = useAuth();
    const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
    const [healthLoading, setHealthLoading] = useState(true);

    useEffect(() => {
        const fetchHealthStatus = async () => {
            try {
                const health = await healthAPI.check();
                setHealthStatus(health);
            } catch {
                //
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
            <header className="bg-gray-900/95 backdrop-blur-sm shadow-xl border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-between items-center py-4">
                        <div className="flex items-center space-x-3 cursor-pointer group"
                             onClick={() => window.location.reload()}>
                            <img
                                src="/src/assets/Vector.svg"
                                alt="2Captcha Icon"
                                className="h-[30px] w-[21px] transition-all duration-200 group-hover:scale-105"
                            />
                            <img
                                src="/src/assets/2Captcha.svg"
                                alt="2Captcha"
                                className="h-[19px] w-[94px] transition-opacity duration-200 group-hover:opacity-80"
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <div
                                className="flex items-center space-x-2 text-sm text-gray-300 bg-gray-800/60 backdrop-blur-sm rounded-full px-3 py-2 border border-gray-600 shadow-sm">
                                <User className="h-4 w-4 text-gray-400"/>
                                <span className="text-gray-200">{user?.email}</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={logout}
                                className="bg-gray-800/80 hover:bg-gray-700 border-gray-600 text-gray-200 hover:text-white shadow-sm"
                            >
                                <LogOut className="h-4 w-4 mr-2"/>
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
                    <APIStatus/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-semibold text-gray-800">Информация о
                                пользователе</CardTitle>
                            <User className="h-5 w-5 text-blue-600"/>
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
                                    <span
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                        Аутентифицирован
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-semibold text-gray-800">Состояние API</CardTitle>
                            <Activity className="h-5 w-5 text-blue-600"/>
                        </CardHeader>
                        <CardContent>
                            {healthLoading ? (
                                <div className="flex items-center justify-center py-4">
                                    <LoadingSpinner size="md"/>
                                </div>
                            ) : healthStatus ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Статус</label>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                healthStatus.status === 'OK'
                                                    ? 'bg-green-100 text-green-800 border-green-200'
                                                    : 'bg-red-100 text-red-800 border-red-200'
                                            }`}>
                                            {healthStatus.status}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">База данных</label>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
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
                            <Clock className="h-5 w-5 text-blue-600"/>
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
                                    <span
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                        Действительный
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Безопасность</label>
                                    <span
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                        Защищено JWT
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Software</h3>
                    <SoftwareList />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;