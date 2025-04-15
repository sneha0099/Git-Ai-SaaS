import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import prisma from '../config/prismaClient';
import { TOKEN_SECRET } from '../config/serverConfig';

interface AuthRequest extends Request {
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

        const decodedToken = jwt.verify(token, TOKEN_SECRET) as JwtPayload;
        if (!decodedToken || !decodedToken.id) {
            return next(new ApiError(401, 'Invalid token'));
        }

        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id },
        });
        if (!user) {
            return next(new ApiError(401, 'User not found'));
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new ApiError(401, 'Invalid or expired token'));
        }
        next(error);
    }
};
