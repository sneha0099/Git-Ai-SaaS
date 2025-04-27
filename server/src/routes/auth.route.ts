import express from 'express';
import validate from '../middlewares/validate.middleware';
import {
    Register,
    Login,
    Verify,
    Logout,
    forgotPassword,
    resetPassword,
    resendOtp,
} from '../controllers/auth.controller';
import {
    RegisterSchema,
    LoginSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema,
    VerifyOtpSchema,
} from '../validators/authSchema';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', validate(RegisterSchema), Register);
router.post('/login', validate(LoginSchema), Login);
router.post('/verify', validate(VerifyOtpSchema), Verify);
router.post('/logout', authMiddleware, Logout);
router.post('/forgot-password', validate(ForgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(ResetPasswordSchema), resetPassword);
router.post('/resend-otp', resendOtp);

export default router;
