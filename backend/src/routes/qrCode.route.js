import {Router} from "express";
import {generateBusinessQR} from "../controllers/qrCode.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/generate", authMiddleware, generateBusinessQR);

export default router;