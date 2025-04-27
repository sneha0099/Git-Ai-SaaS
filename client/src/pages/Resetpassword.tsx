import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import useAuthStore from '@/store/AuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPasswordSchema } from '@/types/AuthSchema';
import * as z from 'zod';
import { toast } from 'sonner';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';
import { useState } from 'react';

export default function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const resetPassword = useAuthStore((state) => state.resetPassword);
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<{ newPassword: string; confirmPassword: string }>({
        resolver: zodResolver(ResetPasswordSchema),
    });

    const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
        try {
            if (!token) {
                toast.error('Invalid or missing token');
                return;
            }
            await resetPassword(token, data.newPassword, data.confirmPassword);
            toast.success('Password reset successfully!');

            reset();
            navigate('/login');
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    'Failed to reset password'
            );
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="max-w-md w-full mx-auto bg-lightTheme">
                <CardHeader>
                    <CardTitle className="text-2xl">Reset Password</CardTitle>
                    <CardDescription>
                        Enter your new password to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    className="inputStyle"
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                    {...register('newPassword')}
                                />
                                <button
                                    type="button"
                                    className="absolute right-0 px-3 py-5 text-sm font-semibold text-gray-600"
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeIcon
                                            className="w-4 h-4"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <EyeClosedIcon
                                            className="w-4 h-4"
                                            aria-hidden="true"
                                        />
                                    )}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="errorMsgStyle">
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="confirmPassword">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <input
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    id="confirmPassword"
                                    className="inputStyle"
                                    placeholder="Re-enter your New Password"
                                    autoComplete="new-password"
                                    {...register('confirmPassword')}
                                />
                                <button
                                    type="button"
                                    className="absolute right-0 px-3 py-5 text-sm font-semibold text-gray-600"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeIcon
                                            className="w-4 h-4"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <EyeClosedIcon
                                            className="w-4 h-4"
                                            aria-hidden="true"
                                        />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="errorMsgStyle">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        Remembered your password?{' '}
                        <Link to="/login" className="underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
