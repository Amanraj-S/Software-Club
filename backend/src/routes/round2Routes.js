import express from 'express';
import { getRound2Access, startRound2, getRound2Questions, submitRound2 } from '../controllers/round2Controller.js';
import { verifyStudentSession } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyStudentSession);

router.get('/access', getRound2Access);
router.post('/start', startRound2);
router.get('/questions', getRound2Questions);
router.post('/submit', submitRound2);

export default router;
