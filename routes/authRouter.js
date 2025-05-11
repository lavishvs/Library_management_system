import express from 'express';
import { register, verifyOTP, login, logout, getUser, forgotPassword, resetPassword } from '../controllers/authController.js';
import {  isAuthenticated, iSAuthorized } from '../Middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.get('/logout',isAuthenticated,logout)
router.get('/me',isAuthenticated, getUser )
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.put('/password/update', isAuthenticated, forgotPassword);
export default router;