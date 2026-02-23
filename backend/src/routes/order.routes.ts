import express from "express";
import { protect } from "../middleware/auth.middleware";
import { createOrder, getUserOrders, getAllOrders } from "../controllers/order.controller";

const router = express.Router();

router.post("/", protect, createOrder); // Auth required
router.get("/my", protect, getUserOrders); // Get own orders
router.get("/", protect, getAllOrders); // Admin only later

export default router;
