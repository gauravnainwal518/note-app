import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import icon from "../assets/icon.svg";
import image from "../assets/image.jpg";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";

interface LoginFormValues {
  email: string;
  otp?: string;
  keepLoggedIn: boolean;
}

const LoginPage: React.FC = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormValues>();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const requestOtp = async (email: string) => {
    await api.post("/auth/request-otp", { email, name: "User" });
    setOtpSent(true);
    setTimer(60);
    alert("OTP sent to your email!");
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      if (!otpSent) {
        await requestOtp(data.email);
        return;
      }
      const response = await api.post("/auth/verify-otp", {
        email: data.email,
        otp: data.otp,
      });

      if (data.keepLoggedIn) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
      }

      alert(`Login Successful! Welcome ${response.data.user.name}`);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    const email = getValues("email");
    if (!email) return alert("Please enter your email first");
    await requestOtp(email);
  };

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      if (!googleToken) throw new Error("Google login failed: No credential returned.");

      const response = await api.post("/auth/google-login", { token: googleToken });

      const keepLoggedIn = getValues("keepLoggedIn");
      if (keepLoggedIn) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
      }

      alert(`Google Login Successful! Welcome ${response.data.user.name}`);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google login error:", error);
      alert(error.response?.data?.message || "Google login failed. Please try again.");
    }
  };

  const handleGoogleLoginError = () => {
    alert("Google login failed. Please try again.");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen relative">
      {/* Logo */}
      <div className="absolute top-4 left-4 flex items-center">
        <img src={icon} alt="Logo" className="w-8 h-8 mr-2" />
        <span className="text-xl font-semibold">HD</span>
      </div>

      {/* Form Section */}
      <div className="flex flex-col justify-center px-6 py-10 w-full lg:w-[30%] bg-white">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-2xl font-bold mb-2">Sign In</h2>
          <p className="text-gray-500 mb-6">Please login to continue to your account.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
                className="w-full border rounded-md px-4 py-2"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* OTP */}
            {otpSent && (
              <div>
                <input
                  type="password"
                  placeholder="OTP"
                  {...register("otp", { required: "OTP is required" })}
                  className="w-full border rounded-md px-4 py-2"
                />
                {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={timer > 0}
                    className={`text-sm ${timer > 0 ? "text-gray-400" : "text-blue-500"}`}
                  >
                    {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center">
              <input type="checkbox" {...register("keepLoggedIn")} className="mr-2" />
              <label className="text-sm text-gray-700">Keep me logged in</label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold"
            >
              {otpSent ? "Sign In" : "Get OTP"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 text-center text-gray-500">or</div>

          {/* Google Login Button */}
          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} />
          </div>

          {/* New Signup Link */}
          <p className="mt-4 text-sm text-center">
            Need an account?{" "}
            <Link to="/" className="text-blue-500 underline font-semibold hover:text-blue-700">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Image Section */}
      <div
        className="hidden lg:block w-[70%] bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: `url(${image})` }}
      />
    </div>
  );
};

export default LoginPage;
