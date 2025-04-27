import { Link } from 'react-router-dom';
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
import { ForgotPasswordSchema } from '@/types/AuthSchema'; // ✅ Import the schema
import * as z from 'zod';
import { toast } from 'sonner';

export default function ForgotPassword() {
    const forgotPassword = useAuthStore((state) => state.forgotPassword);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<{ email: string }>({
        resolver: zodResolver(ForgotPasswordSchema),
    });

    const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
        try {
            await forgotPassword(data.email);
            toast.success(
                'Password reset link sent to your email. Please check your inbox.'
            );
            reset();
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    'Failed to send reset link'
            );
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="max-w-md w-full  mx-auto bg-lightTheme">
                <CardHeader>
                    <CardTitle className="text-2xl">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email address to receive a password reset
                        link.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <Label htmlFor="email">Email</Label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="inputStyle"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="errorMsgStyle">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            Send Reset Link
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
