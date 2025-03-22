import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: DecodedToken;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({
        success: false,
        messgage: 'Unauthorized access',
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as DecodedToken;

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token',
    });
  }
};
