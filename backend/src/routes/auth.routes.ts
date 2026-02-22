import express from "express";
import { register, login } from "../controllers/auth.controller";
import { upload } from "../middleware/upload.middleware";
import { validateRegister } from "../middleware/validate.middleware";

const router = express.Router();

router.post("/register", upload.single("avatar"), validateRegister, register);
router.post("/login", login);
// router.post("/product", protect, adminOnly, createProductController);

export default router;
