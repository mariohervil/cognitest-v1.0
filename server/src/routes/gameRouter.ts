import express from 'express';
import wordGameRouter from './games/word-game/wordGameRouter';
const router = express.Router();

router.use('/wordgame', wordGameRouter);

export default router;
