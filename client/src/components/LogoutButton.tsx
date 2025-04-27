// src/components/LogoutButton.tsx
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/AuthStore';
import { Button } from './ui/button';

const LogoutButton = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
            // Optionally show toast or error
        }
    };

    return (
        <Button variant="outline" onClick={handleLogout}>
            Logout
        </Button>
    );
};

export default LogoutButton;
