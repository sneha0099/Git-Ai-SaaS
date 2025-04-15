import nodemailer from 'nodemailer';
import { generateOtp } from './generateOtp';
import prisma from '../config/prismaClient';

export const sendOtpMail = async (id: string, email: string) => {
    try {
        const { otp, expiresAt } = generateOtp();

        await prisma.otp.upsert({
            where: { userId: id },
            update: { otp: Number(otp), expiresAt },
            create: { userId: id, otp: Number(otp), expiresAt },
        });

        const userName = email.split('@')[0];

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: 'Your OTP code',
            html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>OTP Verification</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style="margin: 0; font-family: 'Poppins', sans-serif; background: #f4f7ff; font-size: 14px;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px; background: #ffffff; border-radius: 10px; text-align: center;">
          <h1 style="color: #333;">Ai-GitSaas</h1>
          <p style="font-size: 16px; color: #555;">Hello <strong>${userName}</strong>,</p>
          <p style="font-size: 16px; color: #555;">
            Thank you for choosing <strong>Ai-GitSaas</strong>. Use the following OTP to complete your verification process.
          </p>
          <div style="font-size: 32px; font-weight: bold; color: #ba3d4f; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #888;">
            This OTP is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.
          </p>
          <p style="font-size: 14px; color: #888;">
            If you didn’t request this, you can safely ignore this email.
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
        console.log(`OTP sent successfully to ${email}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};
