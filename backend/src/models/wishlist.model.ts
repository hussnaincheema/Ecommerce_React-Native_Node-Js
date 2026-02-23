import mongoose, { Schema, Document } from "mongoose";

export interface IWishlistDocument extends Document {
  user: string;
  products: mongoose.Types.ObjectId[];
}

const wishlistSchema = new Schema<IWishlistDocument>(
  {
    user: {
      type: String, // later replace with ObjectId when auth is added
      required: true,
      unique: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model<IWishlistDocument>(
  "Wishlist",
  wishlistSchema
);
