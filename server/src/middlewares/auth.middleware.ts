import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import prisma from '../config/prismaClient';
import { TOKEN_SECRET } from '../config/serverConfig';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return next(new ApiError(401, 'No token provided'));
        }
        console.log(`Token: ${token}`);

        const decodedToken = jwt.verify(token, TOKEN_SECRET) as JwtPayload;
        console.log(` decoded token: ${decodedToken}`);
        console.log(`stringifyid: ${JSON.stringify(decodedToken)}`);

        if (!decodedToken || !decodedToken.id) {
            return next(new ApiError(401, 'Invalid token'));
        }

        const user = await prisma.user.findUnique({
            where: { id: 'e1b57530-bb22-45c6-b19b-7f4612f320f9' },
        });
        console.log(user);
        if (!user) {
            return next(new ApiError(401, 'User not found'));
        }

        req.user = user;
        console.log(user.id);

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new ApiError(401, 'Invalid or expired token'));
        }
        next(error);
    }
};
