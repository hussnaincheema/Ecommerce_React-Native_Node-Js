import { Product } from "../models/product.model";
import { IProduct } from "../types/product.types";

// Create Product
export const createProductService = async (
  name: string,
  price: number,
  stock: number
): Promise<IProduct> => {
  const product = await Product.create({ name, price, stock });

  // Map Mongoose document to IProduct
  return {
    _id: product._id.toString(),
    name: product.name,
    price: product.price,
    stock: product.stock,
  };
};

// Get all products
export const getAllProductsService = async (): Promise<IProduct[]> => {
  const products = await Product.find();

  return products.map((p) => ({
    _id: p._id.toString(),
    name: p.name,
    price: p.price,
    stock: p.stock,
  }));
};

// Get product by ID
export const getProductByIdService = async (id: string): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  return {
    _id: product._id.toString(),
    name: product.name,
    price: product.price,
    stock: product.stock,
  };
};

// Update product
export const updateProductService = async (
  id: string,
  data: Partial<IProduct>
): Promise<IProduct> => {
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!product) throw new Error("Product not found");

  return {
    _id: product._id.toString(),
    name: product.name,
    price: product.price,
    stock: product.stock,
  };
};

// Delete product
export const deleteProductService = async (id: string): Promise<void> => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error("Product not found");
};
