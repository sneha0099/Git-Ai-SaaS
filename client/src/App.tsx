// src/App.tsx
import { RecoilRoot } from 'recoil';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import ForgotPassword from './pages/Forgotpassword';
import ResetPassword from './pages/Resetpassword';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/Protected';
import Layout from './components/Layout';
//import AuthPage from '@/pages/AuthPage';
//import LogoutButton from '@/components/LogoutButton';

export default function App() {
    return (
        <RecoilRoot>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <div>
                                    This is temporary child
                                    <div>hi</div>
                                </div>{' '}
                                {/* 👈 satisfies the `children` prop */}
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                {/* Add more routes as needed */}
            </Routes>
        </RecoilRoot>
    );
}
