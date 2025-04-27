import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RegisterSchema } from '@/types/AuthSchema';
import useAuthStore from '@/store/AuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const RegisterUser = useAuthStore((state) => state.register);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
    });

    const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
        try {
            await RegisterUser(
                data.firstName,
                data.lastName,
                data.email,
                data.password
            );
            toast.success('Registration successful!');
            reset();
            navigate('/verify');
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Registration failed!'
            );
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="max-w-md w-full p-5 mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Register</CardTitle>
                    <CardDescription>
                        Create a new account by filling out the details below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <Label htmlFor="firstName">First Name</Label>
                            <input
                                id="firstName"
                                type="text"
                                placeholder="Enter your first name"
                                className="inputStyle "
                                {...register('firstName')}
                            />
                            {errors.firstName && (
                                <p className="errorMsgStyle">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="lastName">Last Name</Label>
                            <input
                                id="lastName"
                                type="text"
                                placeholder="Enter your last name"
                                className="inputStyle"
                                {...register('lastName')}
                            />
                            {errors.lastName && (
                                <p className="errorMsgStyle">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>

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

                        <div className="mb-4">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    className="inputStyle"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute py-4 right-0 px-3 text-sm font-semibold text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeIcon
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <EyeOffIcon
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="errorMsgStyle">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? 'Registering...' : 'Register'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
