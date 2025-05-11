import express from 'express';
import { getAllUsers, registerNewAdmin } from '../controllers/userController.js';
import { iSAuthorized, isAuthenticated } from '../Middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/all',isAuthenticated, iSAuthorized('admin'), getAllUsers);
router.post("/add/new-admin",isAuthenticated, iSAuthorized('admin'), registerNewAdmin);

export default router;