import express from 'express';
const router = express.Router();
import { getAllUsers, updateUser, deleteUser } from '../Controllers/userController.js';
import verifyToken from '../middlewares/verifyToken.js';
import allowedTo from "../middlewares/allowedTo.js";
router.get('/getAllUsers', verifyToken, allowedTo("ADMIN"), getAllUsers);
router.put('/updateUser/:id', verifyToken, allowedTo("ADMIN"), updateUser);
router.delete('/deleteUser/:id', verifyToken, allowedTo("ADMIN"), deleteUser);
export default router;