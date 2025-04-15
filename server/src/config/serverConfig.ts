import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;
const API_VERSION = process.env.API_VERSION || 'v1';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'secret';
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '1h';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export {
    PORT,
    DATABASE_URL,
    API_VERSION,
    FRONTEND_ORIGIN,
    TOKEN_SECRET,
    TOKEN_EXPIRY,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
};
