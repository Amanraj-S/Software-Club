import { Student } from '../models/Student.js';
import crypto from 'crypto';

export const registerStudent = async (req, res) => {
  try {
    const { name, registerNumber, department, year } = req.body;

    if (!name || !registerNumber || !department || !year) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const uppercaseReg = registerNumber.trim().toUpperCase();

    // Check if student with registerNumber already exists
    let existingStudent = await Student.findOne({ registerNumber: uppercaseReg });

    if (existingStudent) {
      // Return existing student session if re-registering or logging in
      return res.status(200).json({
        success: true,
        message: 'Student session retrieved.',
        sessionId: existingStudent.examSessionId,
        student: {
          id: existingStudent._id,
          name: existingStudent.name,
          registerNumber: existingStudent.registerNumber,
          department: existingStudent.department,
          year: existingStudent.year,
          round1Status: existingStudent.round1Status,
          round1StartedAt: existingStudent.round1StartedAt,
          round2Access: existingStudent.round2Access,
          round2Status: existingStudent.round2Status,
          round2StartedAt: existingStudent.round2StartedAt
        }
      });
    }

    const examSessionId = crypto.randomBytes(16).toString('hex');

    const newStudent = await Student.create({
      name: name.trim(),
      registerNumber: uppercaseReg,
      department: department.trim(),
      year: year.trim(),
      examSessionId,
      round1Status: 'NOT_STARTED',
      qualificationStatus: 'PENDING',
      round2Access: 'LOCKED',
      round2Status: 'NOT_STARTED'
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      sessionId: newStudent.examSessionId,
      student: {
        id: newStudent._id,
        name: newStudent.name,
        registerNumber: newStudent.registerNumber,
        department: newStudent.department,
        year: newStudent.year,
        round1Status: newStudent.round1Status,
        round2Access: newStudent.round2Access,
        round2Status: newStudent.round2Status
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { registerNumber } = req.body;

    if (!registerNumber) {
      return res.status(400).json({ success: false, message: 'Register Number is required.' });
    }

    const uppercaseReg = registerNumber.trim().toUpperCase();
    const existingStudent = await Student.findOne({ registerNumber: uppercaseReg });

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: 'Register Number not found. Please register as a new candidate.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Candidate session restored.',
      sessionId: existingStudent.examSessionId,
      student: {
        id: existingStudent._id,
        name: existingStudent.name,
        registerNumber: existingStudent.registerNumber,
        department: existingStudent.department,
        year: existingStudent.year,
        round1Status: existingStudent.round1Status,
        round1StartedAt: existingStudent.round1StartedAt,
        round2Access: existingStudent.round2Access,
        round2Status: existingStudent.round2Status,
        round2StartedAt: existingStudent.round2StartedAt
      }
    });

  } catch (error) {
    console.error('Candidate Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during candidate login.' });
  }
};

export const getStudentSessionStatus = async (req, res) => {
  try {
    const student = req.student;

    return res.status(200).json({
      success: true,
      student: {
        name: student.name,
        registerNumber: student.registerNumber,
        department: student.department,
        year: student.year,
        round1Status: student.round1Status,
        round1StartedAt: student.round1StartedAt,
        round1SubmittedAt: student.round1SubmittedAt,
        round2Access: student.round2Access,
        round2Status: student.round2Status,
        round2StartedAt: student.round2StartedAt,
        round2SubmittedAt: student.round2SubmittedAt
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving student status.' });
  }
};
