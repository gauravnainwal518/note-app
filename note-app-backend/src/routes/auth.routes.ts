import { Router } from "express";
import { requestOtp, verifyOtp, getMe, googleLogin } from "../controllers/auth.controller";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// OTP-based auth
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);

// Google login route
router.post("/google-login", googleLogin);

// Protected route to get logged-in user info
router.get("/me", authMiddleware, getMe);

export default router;
