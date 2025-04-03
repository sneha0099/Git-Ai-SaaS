import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoute from './routes/auth.route';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectDB();

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Server is UP and runnnningggg',
    });
});

app.use(`/api/v1/auth`, authRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
