import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RegisterSchema } from '@/types/AuthSchema';
import useAuthStore from '@/store/AuthStore';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    //const [auth, setAuth] = useRecoilState(authState);
    const navigate = useNavigate();
    const RegisterUser = useAuthStore((state) => state.register);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
    });

    const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
        setError('');
        setLoading(true);
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

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center items-center min-h-screen">
                <Card className="w-96 p-6 shadow-lg">
                    <CardContent>
                        <h2 className="text-xl font-bold mb-4 text-center">
                            Register
                        </h2>

                        {error && (
                            <p className="text-red-500 text-sm mb-2">{error}</p>
                        )}

                        <div className="grid w-full items-center gap-8">
                            <div className="flex flex-col space-y-1.5 mt-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter your first name"
                                    {...register('firstName')}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col space-y-1.5 mt-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter your last name"
                                    {...register('lastName')}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col space-y-1.5 mt-2">
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

                            <div className="flex flex-col space-y-1.5 mb-2">
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
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </Button>

                        <p className="text-sm text-center mt-3">
                            Already have an account?
                            <span
                                className="text-blue-500 cursor-pointer ml-1"
                                onClick={() => navigate('/login')}
                            >
                                login
                            </span>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
