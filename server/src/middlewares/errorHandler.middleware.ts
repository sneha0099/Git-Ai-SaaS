import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof ApiError) {
        return res
            .status(err.statusCode)
            .json(new ApiResponse(err.statusCode, err.data, err.message));
    }

    return res
        .status(500)
        .json(new ApiResponse(500, null, 'Internal Server Error'));
};

export default errorHandler;
