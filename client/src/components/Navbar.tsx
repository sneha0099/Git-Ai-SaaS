import React from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    return (
        <div className="flex justify-between items-center w-full h-16 bg-blue-200 px-4 py-2 shadow-md">
            <div className="text-blue-950 font-bold text-2xl ">GitGinie</div>
            <div className="flex justify-between gap-4">
                <Button
                    className="cursor-pointer"
                    onClick={() => navigate('/login')}
                >
                    Sign In
                </Button>
                <Button
                    className="cursor-pointer"
                    onClick={() => navigate('/register')}
                >
                    Sign Up
                </Button>
            </div>
        </div>
    );
}

export default Navbar;
