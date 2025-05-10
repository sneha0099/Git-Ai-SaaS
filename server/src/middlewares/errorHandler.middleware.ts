import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import logger from '../utils/logger';

const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message =
        err instanceof ApiError ? err.message : 'Internal Server Error';
    const data = err instanceof ApiError ? err.data : null;

    logger.error(message, {
        statusCode,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        data,
    });

    return res
        .status(statusCode)
        .json(new ApiResponse(statusCode, data, message));
};

export default errorHandler;
