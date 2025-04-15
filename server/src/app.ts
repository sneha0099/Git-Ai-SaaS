import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler.middleware';
import { ApiError } from './utils/ApiError';
import { API_VERSION, FRONTEND_ORIGIN } from './config/serverConfig';
import authRouter from './routes/auth.route';

const app = express();

const corsOptions = {
    origin: [FRONTEND_ORIGIN],
    methods: 'GET,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204, // For legacy browsers
    maxAge: 86400, // Cache preflight request results for 1 day (in seconds)
};
//CORS Middleware
app.use(cors(corsOptions));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
});
//Rate Limiting Middleware
app.use(limiter);

//Body Parser Middleware
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads

//Cookie Parser Middleware
app.use(cookieParser());

//Logging Middleware
app.use(morgan('combined'));

//Compression Middleware
app.use(compression());

//Security Middleware
app.use(helmet());

app.use(`/api/${API_VERSION}/auth`, authRouter);

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP' });
});

app.use('*', (req, res, next) => {
    next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

app.use(
    (
        err: Error | ApiError,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        errorHandler(err, req, res, next);
    }
);

export default app;
