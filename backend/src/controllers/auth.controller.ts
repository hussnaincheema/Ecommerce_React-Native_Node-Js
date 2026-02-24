import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { registerService, loginService } from "../services/auth.service";
import { generateToken } from "../utils/generateToken";
import cloudinary from "../config/cloudinary";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail";
import { User } from "../models/user.model";

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

  // Generate verification token
  const verificationToken = crypto.randomBytes(20).toString("hex");
  user.verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  user.verificationTokenExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await user.save({ validateBeforeSave: false });

  // Send verification email
  const message = `Welcome to Ecommerce App! Please verify your email by using the following token:\n\n${verificationToken}\n\nThis token will expire in 24 hours.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Email Verification",
      message,
    });
  } catch (err) {
    console.error("Email verification send failed:", err);
    res.status(500);
    throw new Error("SMTP Error: Check your backend terminal logs for the verification token if you haven't set up SMTP yet.");
  }

  res.status(201).json({
    success: true,
    message: "User registered successfully. Please check your email to verify your account.",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
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
      message: "User logged in successfully",
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

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found with this email");
  }

  // Get reset token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire (10 minutes)
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  await user.save({ validateBeforeSave: false });

  // Create reset url
  // Note: For mobile, usually we just send the token/code. 
  // But here we'll send a message that includes the token.
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please use the following token to reset your password:\n\n${resetToken}\n\nIf you did not request this, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error("Email could not be sent");
  }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token as string)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful",
    token: generateToken(user._id.toString()),
  });
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const verificationToken = crypto
    .createHash("sha256")
    .update(req.params.token as string)
    .digest("hex");

  const user = await User.findOne({
    verificationToken,
    verificationTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired verification token");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("Email is already verified");
  }

  const verificationToken = crypto.randomBytes(20).toString("hex");
  user.verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  user.verificationTokenExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await user.save({ validateBeforeSave: false });

  const message = `Please verify your email using the following token:\n\n${verificationToken}\n\nThis token will expire in 24 hours.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Email Verification",
      message,
    });

    res.status(200).json({ success: true, message: "Verification email sent" });
  } catch (err) {
    res.status(500);
    throw new Error("Email could not be sent");
  }
});
