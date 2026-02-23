import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  getWishlistService,
  addToWishlistService,
  removeFromWishlistService,
} from "../services/wishlist.service";

export const getWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;

    const wishlist = await getWishlistService(userId);

    res.status(200).json({
      success: true,
      message: "Wishlist retrieved successfully",
      wishlist,
    });
  }
);

export const addToWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, productId } = req.body;

    const wishlist = await addToWishlistService(userId, productId);

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });
  }
);

export const removeFromWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, productId } = req.body;

    const wishlist = await removeFromWishlistService(userId, productId);

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist,
    });
  }
);
