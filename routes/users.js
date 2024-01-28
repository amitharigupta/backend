import express from 'express';
var router = express.Router();

import AuthController from '../controllers/AuthController.js';

router.post('/auth/register', AuthController.register);

router.post('/auth/login', AuthController.login);

export default router;
