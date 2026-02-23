import express from "express";
import { protect } from "../middleware/auth.middleware";
import { mockPayment } from "../controllers/payment.controller";

const router = express.Router();

router.post("/mock-pay", protect, mockPayment);

export default router;
