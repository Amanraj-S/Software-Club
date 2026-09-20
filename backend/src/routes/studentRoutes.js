import express from 'express';
import { registerStudent, loginStudent, getStudentSessionStatus } from '../controllers/studentController.js';
import { verifyStudentSession } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/session', verifyStudentSession, getStudentSessionStatus);

export default router;
