import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/AuthStore';

const ProtectedRoute = ({ children }: { children: any }) => {
    const { isAuthenticated } = useAuthStore();
    console.log(isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default ProtectedRoute;
