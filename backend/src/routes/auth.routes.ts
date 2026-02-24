import express from "express";
import { register, login, forgotPassword, resetPassword, verifyEmail, resendVerification } from "../controllers/auth.controller";
import { upload } from "../middleware/upload.middleware";
import { validateRegister } from "../middleware/validate.middleware";

const router = express.Router();

router.post("/register", upload.single("avatar"), validateRegister, register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

export default router;
