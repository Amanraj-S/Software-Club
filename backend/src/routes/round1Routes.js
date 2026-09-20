import express from 'express';
import { startRound1, getRound1Questions, submitRound1 } from '../controllers/round1Controller.js';
import { verifyStudentSession } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyStudentSession);

router.post('/start', startRound1);
router.get('/questions', getRound1Questions);
router.post('/submit', submitRound1);

export default router;
