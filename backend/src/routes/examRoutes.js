import express from 'express';
import { logViolation } from '../controllers/violationController.js';
import { getPublicConfig } from '../controllers/adminController.js';
import { verifyStudentSession } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public system config route
router.get('/config', getPublicConfig);

// Student session protected routes
router.use(verifyStudentSession);
router.post('/violation', logViolation);

export default router;
