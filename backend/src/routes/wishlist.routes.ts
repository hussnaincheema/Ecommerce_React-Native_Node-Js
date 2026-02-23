import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller";
import { validateWishlist } from "../middleware/wishlist.middleware";

const router = express.Router();

router.get("/:userId", getWishlist);
router.post("/", validateWishlist, addToWishlist);
router.delete("/", validateWishlist, removeFromWishlist);

export default router;
