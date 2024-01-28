import express from 'express';
const router = express.Router();

import usersRouter from './users.js';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/users', usersRouter);

export default router;
