// import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
// // import PrivateRoute from './components/PrivateRoute';
// // import ConditionalRoute from './components/ConditionalRoute';
// // import PublicRoute from './components/PublicRoute'; // ✅ Import PublicRoute
// import useAuthStore from '../store/AuthStore';
// import ProtectedRoute from './Protected';
// import Layout from '../components/Layout';
// import Homepage from '../pages/Homepage';
// import Login from '../pages/Login';
// import Register from '../pages/Register';
// import Verify from '../pages/Verify';
// import ForgotPassword from '../pages/Forgotpassword';
// import ResetPassword from '../pages/Resetpassword';
// // import Dashboard from '../pages/Dashboard';
// // import Sidebar from '../components/Sidebar';

// const AppRouter = () => {
//     const { isVerifying, isResettingPassword } = useAuthStore();

//     return (
//         <Router>
//             <Routes>
//                 {/* Public Routes */}
//                 <Route path="/" element={<Homepage />} />
//                 <Route path="/forgot-password" element={<ForgotPassword />} />

//                 {/* ✅ Protect Login & Register Pages from Logged-in Users */}
//                 <Route element={<PublicRoute />}>
//                     <Route path="/login" element={<Login />} />
//                     <Route path="/register" element={<Register />} />
//                 </Route>

//                 {/* ✅ Conditionally Protected Routes */}
//                 <Route
//                     element={
//                         <ConditionalRoute
//                             condition={isVerifying}
//                             redirectTo="/"
//                         />
//                     }
//                 >
//                     <Route path="/verify" element={<Verify />} />
//                 </Route>

//                 <Route
//                     element={
//                         <ConditionalRoute
//                             condition={isResettingPassword}
//                             redirectTo="/"
//                         />
//                     }
//                 >
//                     <Route path="/reset-password" element={<ResetPassword />} />
//                 </Route>

//                 {/* 🔒 Fully Protected Routes - Requires Authentication */}
//                 <Route
//                     path="/dashboard"
//                     element={
//                         <ProtectedRoute>
//                             <Layout>
//                                 <div>This is temporary child</div>{' '}
//                                 {/* 👈 satisfies the `children` prop */}
//                             </Layout>
//                         </ProtectedRoute>
//                     }
//                 />
//             </Routes>
//         </Router>
//     );
// };

// export default AppRouter;

// src/routes/routes.tsx
import { Routes, Route } from 'react-router-dom';
import Homepage from '@/pages/Homepage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Verify from '@/pages/Verify';
import ForgotPassword from '@/pages/Forgotpassword';
import ResetPassword from '@/pages/Resetpassword';
import ProtectedRoute from '@/routes/Protected';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Createpage from '@/pages/Createpage';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected dashboard route */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/create"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Createpage />
                        </Layout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
