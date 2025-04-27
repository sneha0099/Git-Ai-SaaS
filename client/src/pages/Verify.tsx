import { useState, useEffect } from 'react';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/AuthStore';
import { resendOtp } from '@/services/authservice';
import { verifyOtp } from '@/services/authservice';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import { useForm } from 'react-hook-form';
import { VerifyOtpSchema } from '@/types/AuthSchema';
import { toast } from 'sonner';

export default function VerifyPage() {
    const [cooldown, setCooldown] = useState(0);
    const [isResending, setIsResending] = useState(false);

    const navigate = useNavigate();

    const userId = useAuthStore((state) => state.user?.id as string);

    const {
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof VerifyOtpSchema>>({
        defaultValues: {
            otp: '',
            userId: userId,
        },
    });

    const watchedOtp = watch('otp');

    useEffect(() => {
        if (cooldown === 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const onSubmit = async (data: z.infer<typeof VerifyOtpSchema>) => {
        try {
            await verifyOtp(data.otp, data.userId);
            toast.success('OTP verified successfully!');
            reset();
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to verify OTP!'
            );
            reset();
        }
    };

    const resendOtpSubmit = async () => {
        if (cooldown > 0 || isResending) return;
        try {
            setIsResending(true);
            if (!userId) {
                toast.error('User ID is not available!');
                return;
            }
            await resendOtp(userId);
            toast.success('OTP resent successfully!');
            reset();
            setCooldown(30);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to resend OTP!'
            );
            reset();
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="max-w-md w-full mx-auto ">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Verify Your Account
                    </CardTitle>
                    <CardDescription>
                        To keep your account secure, please enter the One-Time
                        Password (OTP) sent to your registered email. This helps
                        us confirm your identity.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <div className="flex justify-between">
                                <Label htmlFor="verifyOtp">
                                    One-Time Password
                                </Label>
                                <button
                                    type="button"
                                    aria-label="Resend OTP"
                                    onClick={resendOtpSubmit}
                                    disabled={cooldown > 0}
                                    className="text-sm underline text-blue-500 disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
                                >
                                    {isResending
                                        ? 'Sending...'
                                        : cooldown > 0
                                          ? `Resend OTP (${cooldown}s)`
                                          : 'Resend OTP?'}
                                </button>
                            </div>
                            <div className="flex flex-col items-center justify-center mt-2">
                                <InputOTP
                                    maxLength={6}
                                    value={watchedOtp}
                                    onChange={(value) => setValue('otp', value)}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                                {errors.otp && (
                                    <p className="errorMsgStyle text-red-500">
                                        {errors.otp.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button
                            className="w-full"
                            disabled={isSubmitting}
                            type="submit"
                        >
                            Verify OTP
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
