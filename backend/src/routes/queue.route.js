import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import { getBusinessQueue, callNextCustomer, updateQueueStatus } from "../controllers/queue.controller.js";


const router = Router();

//protected routes
router.use(authMiddleware);

router.get("/business/queue", getBusinessQueue);
router.patch("/business/queue/call-next", callNextCustomer);
router.patch("/business/queue/:id/status", updateQueueStatus);

export default router;