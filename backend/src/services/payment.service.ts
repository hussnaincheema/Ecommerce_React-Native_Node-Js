import mongoose from "mongoose";
import { Order } from "../models/order.model";

export const mockPaymentService = async (
  orderId: string,
  userId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  // Ensure user owns the order
  if (order.user.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }

  if (order.isPaid) {
    throw new Error("Order already paid");
  }

  // Simulate payment success
  order.status = "paid";
  order.isPaid = true;
  order.paidAt = new Date();

  await order.save();

  return order;
};
