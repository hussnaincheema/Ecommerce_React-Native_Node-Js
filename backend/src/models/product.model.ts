import mongoose, { Schema, Document } from "mongoose";

export interface IProductDocument extends Document {
  name: string;
  price: number;
  stock: number;
}

const productSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProductDocument>("Product", productSchema);
