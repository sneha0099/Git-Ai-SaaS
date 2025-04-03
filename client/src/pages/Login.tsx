import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoginSchema } from '@/types/AuthSchema';
import useAuthStore from '@/store/AuthStore';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    //const [auth, setAuth] = useRecoilState(authState);
    const navigate = useNavigate();
    const loginUser = useAuthStore((state) => state.login);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        setError('');
        setLoading(true);
        try {
            await loginUser(data.email, data.password);
            alert('Login successful!');
            navigate('/');
        } catch (error) {
            alert('Login failed!');
            console.log('login failed', error);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center items-center min-h-screen">
                <Card className="w-96 p-6 shadow-lg">
                    <CardContent>
                        <h2 className="text-xl font-bold mb-4 text-center">
                            Login
                        </h2>

                        {error && (
                            <p className="text-red-500 text-sm mb-2">{error}</p>
                        )}

                        <div className="grid w-full items-center gap-8">
                            {/* Email Input */}
                            <div className="flex flex-col space-y-1.5 mt-4">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password Input with Forgot Password Link */}
                            <div className="flex flex-col space-y-1.5 mb-1">
                                <Label>Password</Label>
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register('password')}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm">
                                        {errors.password.message}
                                    </p>
                                )}

                                {/* Forgot Password Link */}
                                <p
                                    className="text-sm text-blue-500 cursor-pointer text-right"
                                    onClick={() => navigate('/forgot-password')}
                                >
                                    Forgot Password?
                                </p>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>

                        <p className="text-sm text-center mt-3">
                            <span> Don&apos;t have an account?</span>
                            <span
                                className="text-blue-500 cursor-pointer ml-1"
                                onClick={() => navigate('/register')}
                            >
                                Sign up
                            </span>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
