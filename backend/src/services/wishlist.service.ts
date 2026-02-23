import mongoose from "mongoose";
import { Wishlist } from "../models/wishlist.model";

// Get or create wishlist
export const getWishlistService = async (userId: string) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate("products");

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }

  return wishlist;
};

// Add product to wishlist
export const addToWishlistService = async (
  userId: string,
  productId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid productId");
  }

  const wishlist = await getWishlistService(userId);

  const alreadyExists = wishlist.products.some(
    (p) => p.toString() === productId
  );

  if (!alreadyExists) {
    wishlist.products.push(new mongoose.Types.ObjectId(productId));
  }

  await wishlist.save();
  return wishlist.populate("products");
};

// Remove product
export const removeFromWishlistService = async (
  userId: string,
  productId: string
) => {
  const wishlist = await getWishlistService(userId);

  wishlist.products = wishlist.products.filter(
    (p) => p.toString() !== productId
  );

  await wishlist.save();
  return wishlist.populate("products");
};
