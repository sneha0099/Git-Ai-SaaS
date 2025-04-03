import crypto from 'crypto';

export const generateOtp = () => {
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    return { otp, expiresAt };
};
