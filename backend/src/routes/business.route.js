import { Router } from "express";
import { registerBusiness, loginBusiness,  businessProfile, logoutBusiness } from "../controllers/business.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

//public routes
router.route("/register").post(registerBusiness);
router.route("/login").post(loginBusiness);
router.route("/logout").post(logoutBusiness);

router.route("/profile").get(authMiddleware, businessProfile);

export default router;