import express from 'express';
var router = express.Router();
import authMiddleware from "../middlewares/auth.middleware.js";

import AuthController from '../controllers/AuthController.js';

router.post('/auth/register', AuthController.register);

router.post('/auth/login', AuthController.login);

router.get('/', authMiddleware, AuthController.getUserDetails);

// Profile update
router.patch('/profile/:id', authMiddleware, AuthController.updateUserProfile)

export default router;
