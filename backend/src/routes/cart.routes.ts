import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cart.controller";
import { validateCartItem } from "../middleware/cart.middleware";

const router = express.Router();

router.get("/:userId", getCart);
router.post("/", validateCartItem, addToCart);
router.put("/", validateCartItem, updateCartItem);
router.delete("/", validateCartItem, removeCartItem);

export default router;
