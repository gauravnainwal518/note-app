import React, { useState } from "react";
import { useForm } from "react-hook-form";
import icon from "../assets/icon.svg";
import image from "../assets/image.jpg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import api from "../api/axios"; // <-- our axios instance
import { useNavigate } from "react-router-dom";

interface LoginFormValues {
  email: string;
  otp?: string;
  keepLoggedIn: boolean;
}

const LoginPage: React.FC = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      if (!otpSent) {
        // Step 1: Request OTP
        await api.post("/auth/request-otp", { email: data.email, name: "User" });
        setOtpSent(true);
        alert("OTP sent to your email!");
        return;
      }

      // Step 2: Verify OTP
      const response = await api.post("/auth/verify-otp", {
        email: data.email,
        otp: data.otp,
      });

      // Save token in localStorage
      localStorage.setItem("token", response.data.token);

      // Show success message and redirect
      alert(`Login Successful! Welcome ${response.data.user.name}`);
      navigate("/dashboard"); // Redirect to dashboard

    } catch (error: any) {
      console.error("Login error:", error);
      alert(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Logo */}
      <div className="absolute top-6 left-6 flex items-center">
        <img src={icon} alt="Logo" className="w-8 h-8 mr-2" />
        <span className="text-xl font-semibold">HD</span>
      </div>

      {/* Left Form Section */}
      <div className="flex flex-col justify-center ml-12 px-6 w-full lg:w-[30%] bg-white">
        <div className="-mt-10">
          <h2 className="text-2xl font-bold mb-2">Sign In</h2>
          <p className="text-gray-500 mb-6">
            Please login to continue to your account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Email Field */}
            <div className="relative">
              <div className="absolute -top-3 left-0">
                <span className="bg-white px-2 text-gray-500 text-sm ml-4">
                  Email
                </span>
              </div>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* OTP Field (if OTP sent) */}
            {otpSent && (
              <div className="relative">
                <input
                  type={showOtp ? "text" : "password"}
                  placeholder="OTP"
                  {...register("otp", {
                    required: "OTP is required",
                    minLength: {
                      value: 4,
                      message: "OTP must be at least 4 digits",
                    },
                  })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:ring focus:ring-blue-500"
                />

                {/* Eye Button */}
                <button
                  type="button"
                  onClick={() => setShowOtp((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-500"
                >
                  {showOtp ? (
                    <AiOutlineEyeInvisible
                      size={20}
                      className="relative -top-[1px]"
                    />
                  ) : (
                    <AiOutlineEye size={20} className="relative -top-[1px]" />
                  )}
                </button>

                {errors.otp && (
                  <p className="text-red-500 text-sm">{errors.otp.message}</p>
                )}

                {/* Resend OTP Link */}
                <div className="mt-2">
                  <a href="#" className="text-blue-500 text-sm">
                    Resend OTP
                  </a>
                </div>
              </div>
            )}

            {/* Keep me logged in */}
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("keepLoggedIn")}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">
                Keep me logged in
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold"
            >
              {otpSent ? "Sign In" : "Get OTP"}
            </button>
          </form>

          <p className="mt-4 text-sm">
            Need an account?{" "}
            <a href="/signup" className="text-blue-500 font-semibold">
              Create one
            </a>
          </p>
        </div>
      </div>

      {/* Right Image Section */}
      <div
        className="hidden lg:block w-[70%] bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: `url(${image})` }}
      ></div>
    </div>
  );
};

export default LoginPage;
