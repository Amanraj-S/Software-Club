import express from 'express';
import { logViolation } from '../controllers/violationController.js';
import { verifyStudentSession } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyStudentSession);

router.post('/violation', logViolation);

export default router;
