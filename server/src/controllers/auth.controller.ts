import prisma from '../config/prismaClient';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { sendOtpMail } from '../utils/sendOtpMailer';
import { sendforgotPasswordMail } from '../utils/sendForgotPasswordMail';
//import { generateOtp } from '../utils/generateOtp';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import {
    COMPARE_PASSWORD,
    COOKIE_OPTIONS,
    HASH_PASSWORD,
    JWT_SIGN,
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
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false, // Secure only in production
            sameSite: 'strict',
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
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
            res.status(400).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        const resetToken = jwt.sign(
            { email },
            process.env.JWT_SECRET as string,
            {
                expiresIn: '15m',
            }
        );

        console.log(resetToken);

        await sendforgotPasswordMail(email, resetToken);

        res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully',
            data: {
                resetToken,
            },
        });
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
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from Bearer

        if (!token) {
            res.status(400).json({
                success: false,
                message: 'Token not provided',
            });
            return;
        }

        const { newPassword, confirmPassword } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            email: string;
        };

        const user = await prisma.user.findUnique({
            where: {
                email: decoded.email,
            },
        });

        if (!user) {
            res.status(400).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            res.status(400).json({
                success: false,
                message: 'Passwords do not match',
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: {
                email: decoded.email,
            },
            data: {
                password: hashedPassword,
            },
        });

        res.status(200).json({
            success: true,
            message: 'Password reset successfully',
        });
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
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            res.status(400).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        // const { otp, expiresAt } = generateOtp();
        // const numericOtp = parseInt(otp);

        // await prisma.otp.upsert({
        //     where: { userId: user.id },
        //     update: { otp: numericOtp, expiresAt },
        //     create: {
        //       userId: user.id,
        //       otp: numericOtp,
        //       expiresAt,
        //     },
        //   });

        await sendOtpMail(user.id, email);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
        });
    } catch (error) {
        next(error);
    }
};
