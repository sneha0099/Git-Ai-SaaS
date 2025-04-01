import prisma from '../config/db';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { sendOtpMail } from '../utils/sendOtpMailer';
import { sendforgotPasswordMail } from '../utils/sendForgotPasswordMail';
import { generateToken } from '../utils/generateToken';
import { AuthRequest } from '../middlewares/auth.middleware';
import { generateOtp } from '../utils/generateOtp';
import jwt from 'jsonwebtoken';

export const Register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const ifUserExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (ifUserExists) {
      res.status(400).json({
        success: false,
        message: 'User already exists',
        errors: null,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    const isUserCreated = await prisma.user.findUnique({
      where: {
        id: newUser.id,
      },
    });

    if (!isUserCreated) {
      res.status(500).json({
        success: false,
        message: 'User creation failed',
      });
      return;
    }

    try {
      await sendOtpMail(newUser.email);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    console.error('Registeration failed', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'User not found',
        errors: null,
      });
      return;
    }

    if (user.isVerified === false) {
      res.status(400).json({
        success: false,
        message: 'User not verified',
        errors: null,
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({
        success: false,
        message: 'Invalid password',
        errors: null,
      });
      return;
    }

    const token = generateToken(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false, // Secure only in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry
    });

    const { password: _, ...userData } = user;

    res.status(200).json({
      success: true,
      data: userData,
      message: 'logged in succesfully',
      token,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const Verify = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await prisma.otp.findUnique({ where: { email } });

    if (!otpRecord) {
      res.status(400).json({
        success: false,
        message: 'Otp has not found or invalid',
      });
      return;
    }

    if (otpRecord.otp !== otp) {
      res.status(400).json({
        success: false,
        message: 'Otp is invalid',
      });
      return;
    }

    if (otpRecord.expiresAt < new Date()) {
      res.status(400).json({
        success: false,
        message: 'Otp has expired',
      });
      return;
    }

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        isVerified: true,
      },
    });

    await prisma.otp.delete({
      where: {
        email,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Otp verified successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};
export const Logout = async (req: AuthRequest, res: Response) => {
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
    res.status(500).json({
      success: false,
      message: 'something went wrong while logging out',
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
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

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET as string, {
      expiresIn: '15m',
    });

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
    res.status(500).json({
      success: false,
      message: 'Something went wrong while sending password reset email',
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer

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
    res.status(500).json({
      success: false,
      message: 'Something went wrong while resetting password',
    });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
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

    const { otp, expiresAt } = generateOtp();

    await prisma.otp.upsert({
      where: { email },
      update: { otp, expiresAt },
      create: { email, otp, expiresAt },
    });

    await sendOtpMail(email);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong while sending OTP',
    });
  }
};
