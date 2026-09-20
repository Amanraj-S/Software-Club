import express from 'express';
import {
  loginAdmin,
  logoutAdmin,
  getDashboardStats,
  getStudentsList,
  getStudentDetail,
  grantRound2Access,
  revokeRound2Access,
  grantSelectedRound2Access,
  exportResultsCSV
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public login
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);

// Protected Admin Routes
router.use(protectAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/students', getStudentsList);
router.get('/students/:id', getStudentDetail);
router.get('/results', getStudentsList);
router.get('/export', exportResultsCSV);

router.post('/round2/grant/:studentId', grantRound2Access);
router.post('/round2/revoke/:studentId', revokeRound2Access);
router.post('/round2/grant-selected', grantSelectedRound2Access);

export default router;
