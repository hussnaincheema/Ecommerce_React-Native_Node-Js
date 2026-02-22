import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { registerService, loginService } from "../services/auth.service";
import { generateToken } from "../utils/generateToken";
import cloudinary from "../config/cloudinary";

// Register user
export const register = asyncHandler(async (req: any, res) => {
  const { name, email, password } = req.body;

  let avatarUrl;
  if (req.file) {
    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "ecommerce/avatars" },
        (error, result) => {
          if (error) return reject(new Error("Cloudinary upload failed"));
          resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });
    avatarUrl = uploadResult.secure_url;
  }

  const user = await registerService(name, email, password, avatarUrl);

  res.status(201).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
    token: generateToken(user._id.toString()),
  });
});

// Login user
export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await loginService(email, password);

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id.toString()),
    });
  }
);
