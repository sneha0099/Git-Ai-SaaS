import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError';

const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const parsedBody = schema.safeParse(req.body);

        if (!parsedBody.success) {
            next(
                new ApiError(
                    400,
                    parsedBody.error?.errors[0].message,
                    null,
                    parsedBody.error?.errors
                )
            );
            return;
        }

        next();
    };
};

export default validate;
