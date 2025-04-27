import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/AuthStore';

const ProtectedRoute = ({
    children,
    type,
}: {
    children: any;
    type: 'auth' | 'private';
}) => {
    const { isAuthenticated } = useAuthStore();

    if (type === 'auth' && isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    if (type === 'private' && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
