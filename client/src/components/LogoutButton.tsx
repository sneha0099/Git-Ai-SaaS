// src/components/LogoutButton.tsx
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/AuthStore';
import { Button } from './ui/button'; // ShadCN Button component

const LogoutButton = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout(); // Clear the auth state
        navigate('/login'); // Redirect to login page
    };

    return (
        <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full sm:w-auto bg-red-500 text-white hover:bg-red-600"
        >
            Logout
        </Button>
    );
};

export default LogoutButton;
