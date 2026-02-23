import { Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthRequest } from "../middleware/auth.middleware";
import { mockPaymentService } from "../services/payment.service";

export const mockPayment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { orderId } = req.body;

    if (!orderId) {
      res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
      return;
    }

    const userId = req.user!._id?.toString ? req.user!._id.toString() : req.user!._id;
    const order = await mockPaymentService(orderId, userId);

    res.status(200).json({
      success: true,
      message: "Payment successful (MOCK)",
      order,
    });
  }
);
