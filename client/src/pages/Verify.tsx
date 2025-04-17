// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     InputOTP,
//     InputOTPGroup,
//     InputOTPSeparator,
//     InputOTPSlot,
// } from '@/components/ui/input-otp';
// import { Button } from '@/components/ui/button';
// import useAuthStore from '@/store/AuthStore';

// export default function Verify() {
//     const [otp, setOtp] = useState<string>(''); // ✅ Define OTP state
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     const userId = useAuthStore((state) => state.user?.id as string); // ✅ Get userId from AuthStore

//     //const email = useAuthStore.getState().user?.email as string; // ✅ Get email from AuthStore
//     const verifyOtp = useAuthStore((state) => state.verify);
//     const navigate = useNavigate();

//     const handleVerify = async () => {
//         setError('');

//         setLoading(true);
//         try {
//             console.log(otp, userId);

//             await verifyOtp(otp, userId); // ✅ Now passing both email & OTP correctly
//             alert('OTP verified successfully!');
//             navigate('/dashboard'); // Redirect to dashboard or any other page
//         } catch (err) {
//             setError('Invalid OTP. Please try again.');
//             console.error('OTP verification failed', err);
//         }
//         setLoading(false);
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen">
//             <div className="w-96 p-6 shadow-lg bg-white rounded-lg">
//                 <div className="flex flex-col items-center justify-center">
//                     <h2 className="text-xl font-bold mb-4 text-center">
//                         Verify OTP
//                     </h2>

//                     {error && (
//                         <p className="text-red-500 text-sm mb-2 text-center">
//                             {error}
//                         </p>
//                     )}

//                     {/* ✅ Pass OTP state */}
//                     <InputOTP maxLength={6} value={otp} onChange={setOtp}>
//                         <InputOTPGroup>
//                             <InputOTPSlot index={0} />
//                             <InputOTPSlot index={1} />
//                             <InputOTPSlot index={2} />
//                         </InputOTPGroup>
//                         <InputOTPSeparator />
//                         <InputOTPGroup>
//                             <InputOTPSlot index={3} />
//                             <InputOTPSlot index={4} />
//                             <InputOTPSlot index={5} />
//                         </InputOTPGroup>
//                     </InputOTP>
//                 </div>

//                 <Button
//                     onClick={handleVerify}
//                     disabled={loading || otp.length !== 6}
//                     className="w-full mt-4 mb-4"
//                 >
//                     {loading ? 'Verifying...' : 'Verify OTP'}
//                 </Button>
//             </div>
//         </div>
//     );
// }

import { useState, useEffect } from 'react';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import useAuthStore from '../store/AuthStore'; // adjust path
//import { resendOtp } from '../services/authService'; // service we'll create

export default function VerifyPage() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendMessage, setResendMessage] = useState('');
    const [cooldown, setCooldown] = useState(0);

    const verify = useAuthStore((state) => state.verify);
    const resendOtp = useAuthStore((state) => state.resendOtp);
    const userId = useAuthStore((state) => state.user?.id as string);

    console.log(userId);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleVerify = async () => {
        try {
            setLoading(true);
            setError('');
            if (!userId) {
                setError('User ID missing.');
                return;
            }
            await verify(otp, userId);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setError('');
            setResendMessage('');
            if (!userId) {
                setError('User ID missing.');
                return;
            }
            await resendOtp(userId);
            setResendMessage('OTP resent successfully!');
            setCooldown(30); // 30s cooldown
        } catch (err: any) {
            setError('Failed to resend OTP.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-96 p-6 shadow-lg bg-white rounded-lg">
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-xl font-bold mb-4 text-center">
                        Verify OTP
                    </h2>

                    {error && (
                        <p className="text-red-500 text-sm mb-2 text-center">
                            {error}
                        </p>
                    )}
                    {resendMessage && (
                        <p className="text-green-500 text-sm mb-2 text-center">
                            {resendMessage}
                        </p>
                    )}

                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
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
                </div>

                <Button
                    onClick={handleVerify}
                    disabled={loading || otp.length !== 6}
                    className="w-full mt-4 mb-2"
                >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <Button
                    onClick={handleResendOtp}
                    disabled={cooldown > 0}
                    variant="ghost"
                    className="w-full text-sm text-blue-600"
                >
                    {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                </Button>
            </div>
        </div>
    );
}
