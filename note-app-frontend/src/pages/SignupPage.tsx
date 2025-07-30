import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import icon from "../assets/icon.svg";
import image from "../assets/image.jpg";
import api from "../api/axios";  

interface SignupFormValues {
  name: string;
  dob: string;
  email: string;
  otp?: string;
}

const SignupPage: React.FC = () => {
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>();

  const onSubmit = async (data: SignupFormValues) => {
    try {
      if (!otpSent) {
        // Request OTP
        await api.post("/auth/request-otp", {
          email: data.email,
          name: data.name,
        });
        setOtpSent(true);
        alert("OTP sent to your email!");
        return;
      }

      // Verify OTP
      const res = await api.post("/auth/verify-otp", {
        email: data.email,
        otp: data.otp,
      });

      // Save token for future authenticated requests
      localStorage.setItem("token", res.data.token);

      // Success message
      alert(`Signup Successful!\nWelcome ${res.data.user.name}`);

      // Redirect to dashboard
      navigate("/dashboard");

    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
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
          <h2 className="text-2xl font-bold mb-2">Sign up</h2>
          <p className="text-gray-500 mb-6">
            Sign up to enjoy the feature of HD
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Name Field */}
            <div className="relative">
              <div className="absolute -top-3 left-0">
                <span className="bg-white px-2 text-gray-500 text-sm ml-4">
                  Your Name
                </span>
              </div>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* DOB Field */}
            <div className="relative">
              <div className="absolute -top-3 left-0">
                <span className="bg-white px-2 text-gray-500 text-sm ml-4">
                  Date of Birth
                </span>
              </div>
              <input
                type="date"
                {...register("dob", { required: "Date of Birth is required" })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-500"
              />
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="relative">
              <div className="absolute -top-3 left-0">
                <span className="bg-white px-2 text-gray-500 text-sm ml-4">
                  Email Address
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
                <div className="absolute -top-3 left-0">
                  <span className="bg-white px-2 text-gray-500 text-sm ml-4">
                    OTP
                  </span>
                </div>
                <input
                  type="text"
                  {...register("otp", {
                    required: "OTP is required",
                    minLength: {
                      value: 4,
                      message: "OTP must be at least 4 digits",
                    },
                  })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-500"
                />
                {errors.otp && (
                  <p className="text-red-500 text-sm">{errors.otp.message}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold"
            >
              {otpSent ? "Sign Up" : "Get OTP"}
            </button>
          </form>

          <p className="mt-4 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 font-semibold">
              Sign in
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

export default SignupPage;
