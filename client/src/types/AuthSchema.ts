import { z } from 'zod';

export const RegisterSchema = z.object({
    firstName: z.string().min(2, 'Name must be atleast 2 characters'),
    lastName: z.string().min(2, 'Name must be atleast 2 characters'),
    email: z.string().email({ message: 'Invalid email address' }).trim(),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            {
                message:
                    'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character',
            }
        ),
});

export const LoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }).trim(),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            {
                message:
                    'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character',
            }
        ),
});

export const VerifyOtpSchema = z.object({
    otp: z
        .string()
        .length(6, { message: 'OTP must be exactly 6 digits.' })
        .regex(/^\d+$/, { message: 'OTP must contain only numbers.' }),
    userId: z.string().min(1, { message: 'User ID is required.' }),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }).trim(),
});

export const ResetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(6, { message: 'Password must be at least 6 characters' })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                {
                    message:
                        'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character',
                }
            ),
        confirmPassword: z
            .string()
            .min(6, { message: 'Password must be at least 6 characters' })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                {
                    message:
                        'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character',
                }
            ),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });
