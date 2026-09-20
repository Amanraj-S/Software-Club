import express from 'express';
import { runCode, saveDraft, getSavedSubmissions } from '../controllers/codingController.js';
import { verifyStudentSession } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyStudentSession);

router.post('/run', runCode);
router.post('/save', saveDraft);
router.get('/submissions', getSavedSubmissions);

export default router;
