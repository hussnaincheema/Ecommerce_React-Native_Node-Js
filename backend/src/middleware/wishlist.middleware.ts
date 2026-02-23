import { Request, Response, NextFunction } from "express";

export const validateWishlist = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({
      success: false,
      message: "userId and productId are required",
    });
  }

  next();
};
