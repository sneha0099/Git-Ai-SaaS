import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { TOKEN_EXPIRY, TOKEN_SECRET } from '../config/serverConfig';
import { CookieOptions } from 'express';

export const HASH_PASSWORD = async (password: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

export const COMPARE_PASSWORD = async (
    password: string,
    hashedPassword: string
) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const JWT_SIGN = async (userId: string, userEmail: string) => {
    return await jwt.sign(
        {
            id: userId,
            email: userEmail,
        },
        TOKEN_SECRET as jwt.Secret,
        {
            expiresIn: parseInt(TOKEN_EXPIRY as string, 10),
        }
    );
};

export const COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for production, 'lax' for local
};
