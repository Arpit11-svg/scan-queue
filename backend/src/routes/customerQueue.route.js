import Router from "express";
import {joinQueue} from "../controllers/customerQueue.controller.js";

const router = Router();

router.post(":businessId/join-queue", joinQueue);

export default router;
