import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />

                        <Route path="/" element={<Navigate to="/dashboard" replace />} />

                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>

                    <Toaster
                        position="top-right"
                        reverseOrder={false}
                        gutter={8}
                        containerClassName=""
                        containerStyle={{}}
                        toastOptions={{
                            className: '',
                            duration: 4000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                            success: {
                                duration: 3000,
                                iconTheme: {
                                    primary: '#4ade80',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                duration: 4000,
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;