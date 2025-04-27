import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    loginUser,
    registerUser,
    verifyOtp,
    logout,
} from '@/services/authservice'; // ✅ adjust your import

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => Promise<void>;
    verify: (otp: string, userId: string) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
    persist<AuthState>(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: async (email, password) => {
                const { data } = await loginUser(email, password);
                // No need to set token manually, cookie handles it
                set({ user: data, isAuthenticated: true });
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
                set({ user: null, isAuthenticated: false });
            },

            verify: async (otp, userId) => {
                const { user } = await verifyOtp(otp, userId);
                set({ user });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                login: state.login,
                register: state.register,
                logout: state.logout,
                verify: state.verify,
            }),
        }
    )
);

export default useAuthStore;
