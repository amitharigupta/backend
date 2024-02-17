import express from 'express';
var router = express.Router();
import authMiddleware from "../middlewares/auth.middleware.js";

import NewsController from '../controllers/NewsController.js';

router.post('/', authMiddleware, NewsController.store);

router.patch('/:id', authMiddleware, NewsController.update);

router.delete('/:id', authMiddleware, NewsController.destroy);

router.get('/', NewsController.getAllNews);

router.get('/:id', NewsController.show);

export default router;
