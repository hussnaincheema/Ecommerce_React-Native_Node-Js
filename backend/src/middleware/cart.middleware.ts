import { Request, Response, NextFunction } from "express";

export const validateCartItem = (req: Request, res: Response, next: NextFunction) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || quantity === undefined) {
    return res.status(400).json({
      success: false,
      message: "userId, productId and quantity are required",
    });
  }

  next();
};
