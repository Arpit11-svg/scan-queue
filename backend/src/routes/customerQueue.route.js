import Router from "express";
import {joinQueue, getQueuePosition} from "../controllers/customerQueue.controller.js";

const router = Router();

router.post("/:businessId/join-queue", joinQueue);
router.get("/:businessId/entry/:entryId", getQueuePosition);

export default router;