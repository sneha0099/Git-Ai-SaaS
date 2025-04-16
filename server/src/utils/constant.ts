import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { FRONTEND_ORIGIN, TOKEN_SECRET } from '../config/serverConfig';
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

export const JWT_SIGN = async (
    userId: string,
    userEmail: string,
    expiresIn: string = '1d'
) => {
    const token = jwt.sign(
        {
            id: userId,
            email: userEmail,
        },
        TOKEN_SECRET as string,
        {
            expiresIn,
        } as jwt.SignOptions
    );
    return token;
};

export const JWT_VERIFY = async (token: string) => {
    return (await jwt.verify(token, TOKEN_SECRET as string)) as jwt.JwtPayload;
};

export const COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for production, 'lax' for local
};

export const corsOptions = {
    origin: [FRONTEND_ORIGIN],
    methods: 'GET,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204, // For legacy browsers
    maxAge: 86400, // Cache preflight request results for 1 day (in seconds)
};
