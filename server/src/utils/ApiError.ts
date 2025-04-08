class ApiError extends Error {
    statusCode: number;
    data: any;
    errors: any[];
    success: boolean; 

    constructor( 
        statusCode: number,
        message: string = 'something went wrong',
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

    send(res: any) {
        return res.status(this.statusCode).json({
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
            errors: this.errors,
            success: this.success,
        });
    }
}

export { ApiError };
