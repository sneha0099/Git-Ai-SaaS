import { z } from 'zod';

export const RegisterSchema = z.object({
    firstName: z.string().min(2, 'Name must be atleast 2 characters'),
    lastName: z.string().min(2, 'Name must be atleast 2 characters'),
    email: z.string().email('Invalid mail'),
    password: z.string().min(6, 'Password must be atleast 6 characters'),
});

export const LoginSchema = z.object({
    email: z.string().email('Invalid mail'),
    password: z.string().min(6, 'Password must be atleast 6 characters'),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email('Invalid mail'),
});

export const ResetPasswordSchema = z.object({
    newPassword: z.string().min(6, 'Password must be atleast 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be atleast 6 characters'),
});

export const VerifySchema = z.object({
    email: z.string().email('Invalid mail'),
    otp: z.string().length(6, 'OTP must be 6 digits long'),
});
