import { Routes, Route } from 'react-router-dom';
import Homepage from '@/pages/Homepage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Verify from '@/pages/Verify';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/routes/ProtectedRoute';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/Resetpassword';
import Dashboard from '@/pages/Dashboard';
import Createpage from '@/pages/Createpage';
import NotFound from '@/pages/NotFound';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Publicly accessible pages */}
            <Route path="/" element={<Homepage />} />

            {/* Routes protected for only unauthenticated users */}
            <Route
                path="/login"
                element={
                    <ProtectedRoute type="auth">
                        <Login />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <ProtectedRoute type="auth">
                        <Register />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/verify"
                element={
                    <ProtectedRoute type="auth">
                        <Verify />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/forgot-password"
                element={
                    <ProtectedRoute type="auth">
                        <ForgotPassword />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/reset-password"
                element={
                    <ProtectedRoute type="auth">
                        <ResetPassword />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute type="private">
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/create"
                element={
                    <ProtectedRoute type="private">
                        <Layout>
                            <Createpage />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* 404 Not Found Page */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
