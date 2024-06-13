import express from "express";
import { protectRoute } from "../moddleware/protectRoute.js";
import { getNotifications,deleteNotifications } from "../controllers/notifications.controller.js";

const router = express.Router();

router.get("/",protectRoute,getNotifications)
router.delete("/",protectRoute,deleteNotifications)
// router.delete("/:id",protectRoute,deleteOneNotification)

export default router;