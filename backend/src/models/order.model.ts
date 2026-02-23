import mongoose, { Schema, Document } from "mongoose";

export interface IOrderDocument extends Document {
  user: mongoose.Types.ObjectId | string;
  items: {
    product: mongoose.Types.ObjectId | string;
    quantity: number;
  }[];
  totalPrice: number;
  status: "pending" | "paid" | "cancelled";
  paymentMethod: "COD" | "MOCK";
  isPaid: boolean;
  paidAt?: Date;
}

const orderSchema = new Schema<IOrderDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],

    totalPrice: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "MOCK"],
      default: "MOCK",
    },

    isPaid: { type: Boolean, default: false },

    paidAt: Date,
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrderDocument>("Order", orderSchema);
