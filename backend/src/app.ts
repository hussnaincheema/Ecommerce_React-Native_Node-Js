import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.use(errorHandler);


export default app;
