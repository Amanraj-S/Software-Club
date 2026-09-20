import jwt from 'jsonwebtoken';
import { Student } from '../models/Student.js';
import { Admin } from '../models/Admin.js';

export const protectAdmin = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized as admin. Token missing.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const admin = await Admin.findById(decoded.id).select('-passwordHash');

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin session invalid or expired.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized as admin. Invalid token.' });
  }
};

export const verifyStudentSession = async (req, res, next) => {
  try {
    const sessionId = req.headers['x-student-session-id'] || req.query.sessionId || req.body.sessionId;

    if (!sessionId) {
      return res.status(401).json({ success: false, message: 'Student session ID missing.' });
    }

    const student = await Student.findOne({ examSessionId: sessionId });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student session not found. Please register.' });
    }

    req.student = student;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Session verification error.' });
  }
};
