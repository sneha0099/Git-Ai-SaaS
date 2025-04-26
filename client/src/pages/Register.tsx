import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RegisterSchema } from '@/types/AuthSchema';
import useAuthStore from '@/store/AuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function Register() {
    const navigate = useNavigate();
    const RegisterUser = useAuthStore((state) => state.register);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const {
        register,
        handleSubmit,
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
            alert('Registration successful!');
            navigate('/verify');
        } catch (error) {
            alert('Registration failed!');
            console.log('Registration failed', error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-96 p-6 shadow-lg">
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
                            <Input
                                id="firstName"
                                type="text"
                                placeholder="Enter your first name"
                                className="inputStyle"
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
                            <Input
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
                            <Input
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
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                className="inputStyle"
                                {...register('password')}
                            />
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
                            Register
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
