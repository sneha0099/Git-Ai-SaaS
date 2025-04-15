class ApiError extends Error {
    statusCode: number;
    data: any;
    errors: any[];
    success: boolean;

    constructor(
        statusCode: number,
        message: string = 'Something went wrong',
        data: any = null,
        errors: any[] = [],
        stack: string = ''
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.errors = errors;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
