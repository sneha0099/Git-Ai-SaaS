import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler.middleware';
import { ApiError } from './utils/ApiError';
import { API_VERSION } from './config/serverConfig';
import authRouter from './routes/auth.route';
import repoRouter from './routes/repo.route';
import { corsOptions } from './utils/constant';

const app = express();

//CORS Middleware
app.use(cors(corsOptions));

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
//dasdasdasd
app.use(`/api/${API_VERSION}/auth`, authRouter);
app.use(`/api/${API_VERSION}/repo`, repoRouter);

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
