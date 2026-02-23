import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  createOrderService,
  getOrdersByUserService,
  getAllOrdersService,
} from "../services/order.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!._id;
    const { items, totalPrice } = req.body;

    const order = await createOrderService(userId, items, totalPrice);

    res.status(201).json({ success: true, order });
  }
);

export const getUserOrders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!._id;
    const orders = await getOrdersByUserService(userId);

    res.status(200).json({ success: true, orders });
  }
);

export const getAllOrders = asyncHandler(
  async (_req: Request, res: Response) => {
    const orders = await getAllOrdersService();
    res.status(200).json({ success: true, orders });
  }
);
