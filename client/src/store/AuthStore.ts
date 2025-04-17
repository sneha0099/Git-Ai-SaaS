// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import axios from 'axios';

// interface User {
//     id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
// }

// interface AuthState {
//     // emailofUser: string | null;
//     user: User | null;
//     token: string | null;
//     isAuthenticated: boolean;
//     login: (email: string, password: string) => Promise<void>;
//     register: (
//         firstName: string,
//         lastName: string,
//         email: string,
//         password: string
//     ) => Promise<void>;
//     logout: () => void;
//     forgotPassword: (email: string) => Promise<void>;
//     resetPassword: (
//         token: string,
//         newPassword: string,
//         confirmPassword: string
//     ) => Promise<void>;
//     verify: (email: string, otp: string) => Promise<void>;
// }

// const useAuthStore = create<AuthState>()(
//     persist<AuthState>(
//         (set) => ({
//             emailofUser: null,
//             user: null,
//             token: null,
//             isAuthenticated: false,

//             login: async (email, password) => {
//                 try {
//                     const response = await axios.post(
//                         'http://localhost:3000/api/v1/auth/login',
//                         { email, password }
//                     );
//                     const { data, token } = response.data;
//                     axios.defaults.headers.common['Authorization'] =
//                         `Bearer ${token}`;
//                     set({ user: data, token, isAuthenticated: true });
//                 } catch (error) {
//                     console.error('Login failed:', error);
//                     throw error;
//                 }
//             },

//             register: async (firstName, lastName, email, password) => {
//                 try {
//                     const response = await axios.post(
//                         'http://localhost:3000/api/v1/auth/register',
//                         { firstName, lastName, email, password }
//                     );
//                     const { data } = response.data;

//                     set({ user: data });
//                 } catch (error) {
//                     console.error('Registration failed:', error);
//                     throw error;
//                 }
//             },

//             logout: () => {
//                 set({ user: null, token: null, isAuthenticated: false });
//                 // Optionally clear cookies or tokens from storage
//             },

//             forgotPassword: async (email) => {
//                 try {
//                     await axios.post(
//                         'http://localhost:3000/api/v1/auth/forgot-password',
//                         { email }
//                     );
//                 } catch (error) {
//                     console.error('Forgot password failed:', error);
//                     throw error;
//                 }
//             },

//             resetPassword: async (token, newPassword, confirmPassword) => {
//                 console.log(token, newPassword, confirmPassword);

//                 try {
//                     await axios.post(
//                         'http://localhost:3000/api/v1/auth/reset-password',
//                         {
//                             newPassword,
//                             confirmPassword,
//                         },
//                         {
//                             headers: {
//                                 Authorization: `Bearer ${token}`,
//                             },
//                         }
//                     );
//                 } catch (error) {
//                     console.error('Reset password failed:', error);
//                     throw error;
//                 }
//             },

//             verify: async (email, otp) => {
//                 try {
//                     //const userEmail = useAuthStore.getState().user?.email  || email; // ✅ Get email from AuthStore

//                     console.log(email, otp);
//                     const response = await axios.post(
//                         'http://localhost:3000/api/v1/auth/verify',
//                         { email, otp }
//                     );
//                     const { user } = response.data;
//                     set({ user });
//                 } catch (error) {
//                     console.error('Verify failed:', error);
//                     throw error;
//                 }
//             },
//         }),
//         {
//             name: 'auth-storage', // ✅ Unique key to store in localStorage
//             storage: createJSONStorage(() => localStorage), // ✅ Use localStorage
//         }
//     )
// );

// export default useAuthStore;

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
    resendOtp: (userId: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (
        token: string,
        newPassword: string,
        confirmPassword: string
    ) => Promise<void>;
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

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
            },

            resendOtp: async (userId) => {
                await resendOtp(userId);
            },

            forgotPassword: async (email) => {
                await forgotPassword(email);
            },

            resetPassword: async (token, newPassword, confirmPassword) => {
                await resetPassword(token, newPassword, confirmPassword);
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
