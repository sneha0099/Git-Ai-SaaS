import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const loginUser = async (email: string, password: string) => {
    const response = await axios.post(`${API}/auth/login`, { email, password });
    return response.data;
};

export const registerUser = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
) => {
    const response = await axios.post(`${API}/auth/register`, {
        firstName,
        lastName,
        email,
        password,
    });
    return response.data;
};

export const resendOtp = async (userId: string) => {
    await axios.post(`${API}/auth/resend-otp`, { userId });
};

export const forgotPassword = async (email: string) => {
    await axios.post(`${API}/auth/forgot-password`, { email });
};

export const resetPassword = async (
    token: string,
    newPassword: string,
    confirmPassword: string
) => {
    await axios.post(
        `${API}/auth/reset-password`,
        { newPassword, confirmPassword },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};

export const verifyOtp = async (otp: string, userId: string) => {
    const response = await axios.post(`${API}/auth/verify`, { otp, userId });
    return response.data;
};
