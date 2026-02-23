import { Order } from "../models/order.model";
import mongoose from "mongoose";

export const createOrderService = async (
  userId: string,
  items: { product: string; quantity: number }[],
  totalPrice: number
) => {
  // Validate ObjectIds
  items.forEach(item => {
    if (!mongoose.Types.ObjectId.isValid(item.product)) {
      throw new Error(`Invalid product ID: ${item.product}`);
    }
  });

  const order = await Order.create({ user: userId, items, totalPrice });
  return order.populate("items.product");
};

export const getOrdersByUserService = async (userId: string) => {
  return Order.find({ user: userId }).populate("items.product");
};

export const getAllOrdersService = async () => {
  return Order.find().populate("items.product");
};
