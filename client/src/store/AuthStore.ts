import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import {
    loginUser,
    registerUser,
    forgotPassword,
    resetPassword,
    verifyOtp,
    resendOtp,
    logout,
} from '../services/authservice'; // adjust this import as per your folder structure

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => void;
    // resendOtp: (userId: string) => Promise<void>;
    // forgotPassword: (email: string) => Promise<void>;
    // resetPassword: (
    //     token: string,
    //     newPassword: string,
    //     confirmPassword: string
    // ) => Promise<void>;
    verify: (otp: string, userId: string) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
    persist<AuthState>(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (email, password) => {
                const { data, token } = await loginUser(email, password);
                axios.defaults.headers.common['Authorization'] =
                    `Bearer ${token}`;
                set({ user: data, token, isAuthenticated: true });
            },

            register: async (firstName, lastName, email, password) => {
                const { data } = await registerUser(
                    firstName,
                    lastName,
                    email,
                    password
                );
                set({ user: data });
            },

            logout: async () => {
                await logout();
                set({ user: null, token: null, isAuthenticated: false });
            },

            verify: async (otp, userId) => {
                const { user } = await verifyOtp(otp, userId);
                set({ user });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useAuthStore;
