import { Router } from "express";
import { registerBusiness, loginBusiness } from "../controllers/business.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

//public routes
router.route("/register").post(registerBusiness);
router.route("/login").post(loginBusiness);

router.route("/profile").get(authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        business: req.business,
        message: "Authentication works successfully and Business profile retrieved successfully."
    });
});

export default router;