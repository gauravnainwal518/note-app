import { Request, Response } from "express";
import User from "../models/user.model";
import { generateOtp } from "../utils/otp";
import sendEmail from "../utils/sendEmail";
import jwt from "jsonwebtoken";

// Step 1: Request OTP
export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    const otp = generateOtp();

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name });
    }

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
    await user.save();

    await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}`);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

// Step 2: Verify OTP and Login
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};

// Step 3: Get Logged-in User
export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-otp -otpExpires");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};
