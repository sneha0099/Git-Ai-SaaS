import instance from '@/lib/axios';

export const loginUser = async (email: string, password: string) => {
    const response = await instance.post(
        '/auth/login',
        { email, password },
        { withCredentials: false }
    );
    return response.data;
};

export const registerUser = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
) => {
    const response = await instance.post(
        '/auth/register',
        {
            firstName,
            lastName,
            email,
            password,
        },
        { withCredentials: false }
    );
    return response.data;
};

export const logout = async () => {
    await instance.post('/auth/logout');
};

export const resendOtp = async (userId: string) => {
    await instance.post('/auth/resend-otp', { userId });
};

export const forgotPassword = async (email: string) => {
    await instance.post(
        '/auth/forgot-password',
        { email },
        { withCredentials: false }
    );
};

export const resetPassword = async (
    token: string,
    newPassword: string,
    confirmPassword: string
) => {
    await instance.post(
        '/auth/reset-password',
        {
            token,
            newPassword,
            confirmPassword,
        },
        { withCredentials: false }
    );
};

export const verifyOtp = async (otp: string, userId: string) => {
    const response = await instance.post(
        '/auth/verify',
        { otp, userId },
        { withCredentials: false }
    );
    return response.data;
};
