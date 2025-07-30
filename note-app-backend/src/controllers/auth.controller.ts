import { Request, Response } from "express";
import User from "../models/user.model";
import { generateOtp } from "../utils/otp";
import sendEmail from "../utils/sendEmail";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


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
    console.error(error);
    res.status(500).json({ message: "Error sending OTP", error });
  }
};


// Step 2: Verify OTP Login

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
    console.error(error);
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
    console.error(error);
    res.status(500).json({ message: "Error fetching user", error });
  }
};


// Step 4: Google Login

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ message: "Invalid Google token" });

    const { sub: googleId, email, name } = payload;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        googleId,
        email,
        name: name || "",
      });
      await user.save();
    }

    // Generate JWT token for your app
    const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    res.json({
      message: "Google login successful",
      token: appToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Google login failed", error });
  }
};
