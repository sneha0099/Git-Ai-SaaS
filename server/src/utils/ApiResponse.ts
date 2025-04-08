class ApiResponse {
    statusCode: number;
    data: any;
    message: string;
    success: boolean;

    constructor(
        statusCode: number,
        message: string,
        data: any,
        success: boolean
    ) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }

    send(res: any) {
        return res.status(this.statusCode).json(this);
    }
}

export { ApiResponse };
