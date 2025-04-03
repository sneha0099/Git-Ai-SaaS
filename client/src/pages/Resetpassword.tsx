import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import useAuthStore from '@/store/AuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPasswordSchema } from '@/types/AuthSchema';
import * as z from 'zod';

// ✅ Schema validation using Zod
ResetPasswordSchema.refine(
    (data) => data.newPassword === data.confirmPassword,
    {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    }
);

export default function ResetPassword() {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const resetPassword = useAuthStore((state) => state.resetPassword);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // ✅ Get token from URL

    // ✅ Use useForm for validation
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<{ newPassword: string; confirmPassword: string }>({
        resolver: zodResolver(ResetPasswordSchema),
    });

    const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
        setError('');
        setMessage('');

        if (!token) {
            setError('Invalid or expired reset token.');
            return;
        }

        try {
            console.log(token, data.newPassword, data.confirmPassword);

            await resetPassword(token, data.newPassword, data.confirmPassword);
            setMessage('Password reset successfully. You can now login.');
            setTimeout(() => navigate('/login'), 2000); // ✅ Redirect after success
        } catch (err) {
            setError('Failed to reset password. Please try again.');
            console.log('Error resetting password', err);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-96 p-6 shadow-lg">
                <CardContent>
                    <h2 className="text-xl font-bold mb-4 text-center">
                        Reset Password
                    </h2>

                    {error && (
                        <p className="text-red-500 text-sm mb-2">{error}</p>
                    )}
                    {message && (
                        <p className="text-green-500 text-sm mb-2">{message}</p>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col space-y-1.5 mb-4">
                            <Label>New Password</Label>
                            <Input
                                type="password"
                                placeholder="Enter new password"
                                {...register('newPassword')}
                            />
                            {errors.newPassword && (
                                <p className="text-red-500 text-sm">
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col space-y-1.5 mb-4">
                            <Label>Confirm Password</Label>
                            <Input
                                type="password"
                                placeholder="Confirm new password"
                                {...register('confirmPassword')}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm">
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

                    <p className="text-sm text-center mt-3">
                        Remembered your password?
                        <span
                            className="text-blue-500 cursor-pointer ml-1"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </span>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
