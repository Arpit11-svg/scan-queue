import { Router } from "express";
import { registerBusiness, loginBusiness } from "../controllers/business.controller.js";

const router = Router();

router.route("/register").post(registerBusiness);
router.route("/login").post(loginBusiness);

export default router;