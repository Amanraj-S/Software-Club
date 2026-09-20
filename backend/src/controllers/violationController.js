import { ViolationLog } from '../models/ViolationLog.js';
import { Student } from '../models/Student.js';

export const logViolation = async (req, res) => {
  try {
    const student = req.student;
    const { round, eventType } = req.body;

    if (!round || !eventType) {
      return res.status(400).json({ success: false, message: 'Round and event type are required.' });
    }

    // Create log entry
    await ViolationLog.create({
      studentId: student._id,
      round: round === 'ROUND_2' ? 'ROUND_2' : 'ROUND_1',
      eventType,
      timestamp: new Date()
    });

    // Increment student violation count
    student.violationCount = (student.violationCount || 0) + 1;
    await student.save();

    return res.status(200).json({
      success: true,
      message: 'Violation recorded.',
      violationCount: student.violationCount
    });

  } catch (error) {
    console.error('Violation Log Error:', error);
    return res.status(500).json({ success: false, message: 'Server error recording violation.' });
  }
};
