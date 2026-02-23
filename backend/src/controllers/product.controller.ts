import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
} from "../services/product.service";

/**
 * @route POST /api/products
 */
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, price, stock } = req.body;

    const product = await createProductService(name, price, stock);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  }
);

/**
 * @route GET /api/products
 */
export const getProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await getAllProductsService();

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products,
    });
  }
);

/**
 * @route GET /api/products/:id
 */
export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const product = await getProductByIdService(id);

    res.status(200).json({
      message: "Product retrieved successfully",
      success: true,
      product,
    });
  }
);

/**
 * @route PUT /api/products/:id
 */
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const product = await updateProductService(id, req.body);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  }
);

/**
 * @route DELETE /api/products/:id
 */
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await deleteProductService(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }
);
