import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import ConditionalRoute from './components/ConditionalRoute';
import PublicRoute from './components/PublicRoute'; // ✅ Import PublicRoute
import useAuthStore from './store/AuthStore';
import ProtectedRoute from './Protected';

import Homepage from '../pages/Homepage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Verify from '../pages/Verify';
import ForgotPassword from '../pages/Forgotpassword';
import ResetPassword from '../pages/Resetpassword';
import Dashboard from '../pages/Dashboard';
import Sidebar from '../components/Sidebar';

const AppRouter = () => {
    const { isVerifying, isResettingPassword } = useAuthStore();

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Homepage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* ✅ Protect Login & Register Pages from Logged-in Users */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* ✅ Conditionally Protected Routes */}
                <Route
                    element={
                        <ConditionalRoute
                            condition={isVerifying}
                            redirectTo="/"
                        />
                    }
                >
                    <Route path="/verify" element={<Verify />} />
                </Route>

                <Route
                    element={
                        <ConditionalRoute
                            condition={isResettingPassword}
                            redirectTo="/"
                        />
                    }
                >
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Route>

                {/* 🔒 Fully Protected Routes - Requires Authentication */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <div className="flex">
                                <Sidebar />
                                <Dashboard />
                            </div>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRouter;
