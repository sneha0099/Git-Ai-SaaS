import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import useAuthStore from "@/store/AuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "@/types/AuthSchema"; // ✅ Import the schema
import * as z from "zod";


export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const navigate = useNavigate();

  // ✅ Use useForm for form validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
    setError("");
    setMessage("");

    try {
        console.log(data, data.email);
        
      await forgotPassword(data.email);
      setMessage("Password reset link sent to your email.");
        //setTimeout(() => navigate("/reset-password/token"), 2000); // ✅ Redirect after success
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
      console.log("Error sending reset link", err);
      
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-96 p-6 shadow-lg">
        <CardContent>
          <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-1.5 mb-4">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <p className="text-sm text-center mt-3">
            Remembered your password?
            <span
              className="text-blue-500 cursor-pointer ml-1"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
