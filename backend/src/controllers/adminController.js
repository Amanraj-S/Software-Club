import { Admin } from '../models/Admin.js';
import { Student } from '../models/Student.js';
import { Round1Submission } from '../models/Round1Submission.js';
import { CodingSubmission } from '../models/CodingSubmission.js';
import { ViolationLog } from '../models/ViolationLog.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper to issue JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '12h'
  });
};

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    // Check if admin exists in DB; if not, initialize default admin from env
    let admin = await Admin.findOne({ username });

    if (!admin) {
      const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
      const defaultPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';

      if (username === defaultUsername && password === defaultPassword) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(defaultPassword, salt);

        admin = await Admin.create({
          username: defaultUsername,
          passwordHash,
          role: 'ADMIN'
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
      }
    } else {
      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
      }
    }

    const token = generateToken(admin._id);

    return res.status(200).json({
      success: true,
      message: 'Admin login successful.',
      token,
      admin: {
        username: admin.username,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during admin login.' });
  }
};

export const logoutAdmin = async (req, res) => {
  return res.status(200).json({ success: true, message: 'Admin logged out.' });
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const round1Completed = await Student.countDocuments({ round1Status: 'COMPLETED' });
    const qualified = await Student.countDocuments({ qualificationStatus: 'QUALIFIED' });
    const notQualified = await Student.countDocuments({ qualificationStatus: 'NOT_QUALIFIED' });
    const round2AccessGranted = await Student.countDocuments({ round2Access: 'GRANTED' });
    const round2InProgress = await Student.countDocuments({ round2Status: 'IN_PROGRESS' });
    const round2Completed = await Student.countDocuments({ round2Status: 'COMPLETED' });

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        round1Completed,
        qualified,
        notQualified,
        round2AccessGranted,
        round2InProgress,
        round2Completed
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error loading dashboard statistics.' });
  }
};

export const getStudentsList = async (req, res) => {
  try {
    const { search, filter, sortBy, order } = req.query;

    let query = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { registerNumber: regex }, { department: regex }];
    }

    if (filter && filter !== 'all') {
      if (filter === 'qualified') query.qualificationStatus = 'QUALIFIED';
      else if (filter === 'not_qualified') query.qualificationStatus = 'NOT_QUALIFIED';
      else if (filter === 'r2_pending') query.round2Access = 'LOCKED';
      else if (filter === 'r2_granted') query.round2Access = 'GRANTED';
      else if (filter === 'r2_in_progress') query.round2Status = 'IN_PROGRESS';
      else if (filter === 'r2_completed') query.round2Status = 'COMPLETED';
    }

    let sortOption = { createdAt: -1 };
    if (sortBy) {
      const sortOrder = order === 'asc' ? 1 : -1;
      sortOption = { [sortBy]: sortOrder };
    }

    const students = await Student.find(query).sort(sortOption);

    return res.status(200).json({
      success: true,
      students
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving students list.' });
  }
};

export const getStudentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const r1Submission = await Round1Submission.findOne({ studentId: id });
    const codingSubmissions = await CodingSubmission.find({ studentId: id });
    const violations = await ViolationLog.find({ studentId: id }).sort({ timestamp: -1 });

    return res.status(200).json({
      success: true,
      student,
      r1Submission,
      codingSubmissions,
      violations
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving student details.' });
  }
};

export const grantRound2Access = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    // Admin has full authority to grant access to any selected student
    student.round2Access = 'GRANTED';
    student.round2AccessGrantedAt = new Date();
    student.round2AccessGrantedBy = req.admin.username;
    await student.save();

    return res.status(200).json({
      success: true,
      message: `Round 2 access granted to ${student.name} (${student.registerNumber}).`,
      student
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error granting Round 2 access.' });
  }
};

export const revokeRound2Access = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    if (student.round2Status === 'IN_PROGRESS') {
      return res.status(400).json({
        success: false,
        message: `Student ${student.name} is currently IN_PROGRESS with Round 2. Access cannot be silently revoked while exam is active.`
      });
    }

    student.round2Access = 'REVOKED';
    await student.save();

    return res.status(200).json({
      success: true,
      message: `Round 2 access revoked for ${student.name}.`,
      student
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error revoking Round 2 access.' });
  }
};

export const grantSelectedRound2Access = async (req, res) => {
  try {
    const { studentIds } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Select at least one student.' });
    }

    const students = await Student.find({ _id: { $in: studentIds } });
    let grantedCount = 0;
    let skippedCount = 0;

    for (const student of students) {
      student.round2Access = 'GRANTED';
      student.round2AccessGrantedAt = new Date();
      student.round2AccessGrantedBy = req.admin.username;
      await student.save();
      grantedCount++;
    }

    return res.status(200).json({
      success: true,
      message: `Round 2 access granted to ${grantedCount} student(s).`
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error in batch granting Round 2 access.' });
  }
};

export const exportResultsCSV = async (req, res) => {
  try {
    const students = await Student.find().sort({ finalScore: -1 });

    let csvContent = 'Name,Register Number,Department,Year,Round 1 Score,Qualification Status,Round 2 Access,Round 2 Status,Round 2 Score,Final Score,Violation Count,Round 1 Started,Round 1 Submitted,Round 2 Started,Round 2 Submitted\n';

    students.forEach(s => {
      const r1Start = s.round1StartedAt ? new Date(s.round1StartedAt).toLocaleString() : 'N/A';
      const r1Sub = s.round1SubmittedAt ? new Date(s.round1SubmittedAt).toLocaleString() : 'N/A';
      const r2Start = s.round2StartedAt ? new Date(s.round2StartedAt).toLocaleString() : 'N/A';
      const r2Sub = s.round2SubmittedAt ? new Date(s.round2SubmittedAt).toLocaleString() : 'N/A';

      const row = [
        `"${s.name.replace(/"/g, '""')}"`,
        `"${s.registerNumber}"`,
        `"${s.department}"`,
        `"${s.year}"`,
        s.round1Score || 0,
        s.qualificationStatus,
        s.round2Access,
        s.round2Status,
        s.round2Score || 0,
        s.finalScore || 0,
        s.violationCount || 0,
        `"${r1Start}"`,
        `"${r1Sub}"`,
        `"${r2Start}"`,
        `"${r2Sub}"`
      ];

      csvContent += row.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="dsa_competition_results.csv"');
    return res.status(200).send(csvContent);

  } catch (error) {
    console.error('Export CSV Error:', error);
    return res.status(500).json({ success: false, message: 'Error generating CSV export.' });
  }
};
