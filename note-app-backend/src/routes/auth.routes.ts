import { Router } from "express";
import { requestOtp, verifyOtp, getMe } from "../controllers/auth.controller";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.get("/me", authMiddleware, getMe);   // <-- Add this line

export default router;
