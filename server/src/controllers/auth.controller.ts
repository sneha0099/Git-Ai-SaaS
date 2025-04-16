import prisma from '../config/prismaClient';
import { Request, Response, NextFunction } from 'express';
import { sendOtpMail } from '../utils/sendOtpMailer';
import { sendforgotPasswordMail } from '../utils/sendForgotPasswordMail';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import {
    COMPARE_PASSWORD,
    COOKIE_OPTIONS,
    HASH_PASSWORD,
    JWT_SIGN,
    JWT_VERIFY,
} from '../utils/constant';

export const Register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const ifUserExists = await prisma.user.findUnique({
            where: { email },
        });

        if (ifUserExists) {
            throw new ApiError(400, 'User already exists');
        }

        const hashedPassword = await HASH_PASSWORD(password);

        const newUser = await prisma.user.create({
            data: { firstName, lastName, email, password: hashedPassword },
        });

        await sendOtpMail(newUser.id, newUser.email);

        res.status(201).json(
            new ApiResponse(201, newUser, 'User created successfully')
        );
    } catch (error) {
        next(error);
    }
};

export const Login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new ApiError(404, 'User not found. Please register first.');
        }

        if (!user.verified) {
            throw new ApiError(
                403,
                'Account not verified. Please check your email to verify your account.',
                {
                    userId: user.id,
                }
            );
        }

        const isPasswordValid = await COMPARE_PASSWORD(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Incorrect password. Please try again.');
        }

        const token = await JWT_SIGN(user.id, user.email);

        res.status(200)
            .cookie('token', token, COOKIE_OPTIONS)
            .json(
                new ApiResponse(200, { user: user, token }, 'Login successful!')
            );
    } catch (error) {
        next(error);
    }
};

export const Verify = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { otp, userId } = req.body;

        const otpRecord = await prisma.otp.findUnique({ where: { userId } });

        if (!otpRecord) {
            throw new ApiError(404, 'OTP record not found for this user.');
        }

        if (otpRecord.expiresAt < new Date()) {
            throw new ApiError(
                410,
                'OTP has expired. Please request a new one.'
            );
        }

        if (otp !== otpRecord.otp) {
            throw new ApiError(400, 'Invalid OTP provided.');
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { verified: true },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                verified: true,
                profilePicture: true,
            },
        });

        await prisma.otp.deleteMany({
            where: {
                userId,
            },
        });

        const token = await JWT_SIGN(updatedUser.id, updatedUser.email);

        res.status(200)
            .cookie('token', token, COOKIE_OPTIONS)
            .json(
                new ApiResponse(
                    200,
                    { user: updatedUser, token },
                    'Your account has been successfully verified!'
                )
            );
    } catch (error) {
        next(error);
    }
};

export const Logout = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.clearCookie('token', COOKIE_OPTIONS)
            .status(200)
            .json(
                new ApiResponse(200, {}, 'You have successfully logged out.')
            );
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        const resetToken = await JWT_SIGN(user.id, user.email, '15m');

        await sendforgotPasswordMail(email, resetToken);

        res.status(200).json(
            new ApiResponse(
                200,
                {},
                'Password reset email sent successfully. Please check your inbox.'
            )
        );
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { token, newPassword, confirmPassword } = req.body;

        if (!token) {
            throw new ApiError(401, 'Token not provided');
        }

        const decoded = await JWT_VERIFY(token);
        if (!decoded) {
            throw new ApiError(401, 'Invalid reset token');
        }

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },
        });
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        if (newPassword !== confirmPassword) {
            throw new ApiError(
                400,
                'New password and confirm password do not match'
            );
        }

        const hashedPassword = await HASH_PASSWORD(newPassword);

        await prisma.user.update({
            where: {
                id: decoded.id,
            },
            data: {
                password: hashedPassword,
            },
        });

        res.status(200).json(
            new ApiResponse(
                200,
                {},
                'Password reset successfully. You can now log in with your new password.'
            )
        );
    } catch (error) {
        next(error);
    }
};

export const resendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        await sendOtpMail(userId, user.email); //can set rate limit

        res.status(200).json(
            new ApiResponse(
                200,
                {},
                'OTP resent successfully. Please check your email.'
            )
        );
    } catch (error) {
        next(error);
    }
};
