import express from "express";
const router = express.Router();
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats,
} from "../Controllers/contactController.js";
import verifyToken from "../middlewares/verifyToken.js";
import allowedTo from "../middlewares/allowedTo.js";

// Public route - Anyone can send a contact message
router.post("/send", createContact);

// Protected routes - Admin only
router.get("/all", verifyToken, allowedTo("ADMIN"), getAllContacts);
router.get("/stats", verifyToken, allowedTo("ADMIN"), getContactStats);
router.get("/:id", verifyToken, allowedTo("ADMIN"), getContactById);
router.put("/:id/status", verifyToken, allowedTo("ADMIN"), updateContactStatus);
router.delete("/:id", verifyToken, allowedTo("ADMIN"), deleteContact);

export default router;
