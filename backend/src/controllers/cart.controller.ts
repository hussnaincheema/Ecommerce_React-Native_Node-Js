import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  getCartService,
  addToCartService,
  updateCartItemService,
  removeCartItemService,
} from "../services/cart.service";

// Get user cart
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const cart = await getCartService(userId);

  res.status(200).json({ success: true, message: "Cart retrieved successfully", cart });
});

// Add item
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const { productId, quantity } = req.body;

  const cart = await addToCartService(userId, productId, quantity);

  res.status(200).json({ success: true, message: "Item added to cart", cart });
});

// Update quantity
export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const { productId, quantity } = req.body;

  const cart = await updateCartItemService(userId, productId, quantity);

  res.status(200).json({ success: true, message: "Item quantity updated", cart });
});

// Remove item
export const removeCartItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const { productId } = req.body;

  const cart = await removeCartItemService(userId, productId);

  res.status(200).json({ success: true, message: "Item removed from cart", cart });
});
