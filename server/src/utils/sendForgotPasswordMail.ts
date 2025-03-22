import nodemailer from 'nodemailer';
import { generateOtp } from './generateOtp';
import prisma from '../config/db';

export const sendforgotPasswordMail = async (
  email: string,
  forgotPasswordToken: string,
) => {
  try {
    const userName = email.split('@')[0];

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/api/v1/auth/reset-password?token=${forgotPasswordToken}`;

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: 'Reset Your Password - Ai-GitSaas',
      html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style="margin: 0; font-family: 'Poppins', sans-serif; background: #f4f7ff; font-size: 14px;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px; background: #ffffff; border-radius: 10px; text-align: center;">
          <h1 style="color: #333;">Ai-GitSaas</h1>
          <p style="font-size: 16px; color: #555;">Hello <strong>${userName}</strong>,</p>
          <p style="font-size: 16px; color: #555;">
            We received a request to reset your password for your <strong>Ai-GitSaas</strong> account.  
            Click the button below to reset your password:
          </p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; margin: 20px 0; color: #ffffff; background: #ba3d4f; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Reset Password
          </a>
        
          <p style="font-size: 14px; color: #888;">
            This link is valid for <strong>15 minutes</strong>. If you didn’t request this, please ignore this email.
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 12px; color: #aaa;">
            Need help? Contact us at
            <a href="mailto:support@yourcompany.com" style="color: #499fb6; text-decoration: none;">Ai.gitsaas</a>
          </p>
        </div>
      </body>
    </html>
  `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Forgot Password email sent successfully to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};
