import Router from "express";
import {joinQueue, getQueuePosition, leaveQueue} from "../controllers/customerQueue.controller.js";

const router = Router();

router.post("/:businessId/join-queue", joinQueue);
router.get("/:businessId/position/:entryId", getQueuePosition);
router.delete("/:businessId/leave-queue/:entryId", leaveQueue);

export default router;