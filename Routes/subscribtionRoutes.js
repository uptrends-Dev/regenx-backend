import express from "express";
const router = express.Router();
import {
  createSubscribtion,
  getAllSubscribtions,
  deleteSubscribtion,
  getSubscribtionStats,
} from "../Controllers/subscribtionController.js";
import verifyToken from "../middlewares/verifyToken.js";
import allowedTo from "../middlewares/allowedTo.js";

// Public route - Anyone can send a contact message
router.post("/send", createSubscribtion);

// Protected routes - Admin only
router.get("/all", verifyToken, allowedTo("ADMIN"), getAllSubscribtions);
router.get("/stats", verifyToken, allowedTo("ADMIN"), getSubscribtionStats);
router.delete("/:id", verifyToken, allowedTo("ADMIN"), deleteSubscribtion);

export default router;
