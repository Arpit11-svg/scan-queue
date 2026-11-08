import Router from "express";
import {joinQueue, getQueuePosition, leaveQueue} from "../controllers/customerQueue.controller.js";

const router = Router();

router.post("/:businessId/join-queue", joinQueue);
router.get("/status/:publicToken", getQueuePosition);
router.patch("/status/:publicToken/leave", leaveQueue);

export default router;