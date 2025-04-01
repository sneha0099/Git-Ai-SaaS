import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/AuthStore";

export default function Verify() {
  const [otp, setOtp] = useState<string>(""); // ✅ Define OTP state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const email = useAuthStore.getState().user?.email as string; // ✅ Get email from AuthStore
  const verifyOtp = useAuthStore((state) => state.verify);
  const navigate = useNavigate();

  const handleVerify = async () => {
    setError("");

    setLoading(true);
    try {
      console.log(email, otp);

      await verifyOtp(email, otp); // ✅ Now passing both email & OTP correctly
      alert("OTP verified successfully!");
      navigate("/dashboard"); // Redirect to dashboard or any other page
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      console.error("OTP verification failed", err);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-96 p-6 shadow-lg bg-white rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4 text-center">Verify OTP</h2>

          {error && (
            <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
          )}

          {/* ✅ Pass OTP state */}
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
          className="w-full mt-4 mb-4"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>
    </div>
  );
}
