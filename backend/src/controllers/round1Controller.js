import { Student } from '../models/Student.js';
import { Round1Submission } from '../models/Round1Submission.js';
import { getStudentRound1Questions } from '../data/questions/round1QuestionsBackend.js';
import { evaluateRound1Answers } from '../services/scoringService.js';
import { checkRound1EnabledStatus } from './adminController.js';

export const startRound1 = async (req, res) => {
  try {
    const student = req.student;

    if (student.round1Status === 'COMPLETED') {
      return res.status(200).json({
        success: true,
        status: 'COMPLETED',
        message: 'Round 1 has already been submitted and completed.',
        round1StartedAt: student.round1StartedAt,
        durationMinutes: 35
      });
    }

    // Check if Round 1 is enabled by Admin
    const isEnabled = await checkRound1EnabledStatus();
    if (!isEnabled && student.round1Status !== 'IN_PROGRESS') {
      return res.status(403).json({
        success: false,
        message: 'Round 1 has not been enabled by the Administrator yet. Please wait for the announcement.'
      });
    }

    if (student.round1Status === 'NOT_STARTED') {
      student.round1Status = 'IN_PROGRESS';
      student.round1StartedAt = new Date();
      await student.save();
    }

    return res.status(200).json({
      success: true,
      status: 'IN_PROGRESS',
      message: 'Round 1 exam started.',
      round1StartedAt: student.round1StartedAt,
      durationMinutes: 35
    });
  } catch (error) {
    console.error('Start Round 1 Error:', error);
    return res.status(500).json({ success: false, message: 'Server error starting Round 1.' });
  }
};

export const getRound1Questions = async (req, res) => {
  try {
    const questions = getStudentRound1Questions();
    return res.status(200).json({
      success: true,
      questions
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load questions.' });
  }
};

export const submitRound1 = async (req, res) => {
  try {
    const student = req.student;

    if (student.round1Status === 'COMPLETED') {
      return res.status(200).json({
        success: true,
        status: 'COMPLETED',
        message: 'Round 1 completed successfully. Please wait for further instructions.'
      });
    }

    const { answers } = req.body; // map of questionId -> selectedOption index
    const answersMap = answers || {};

    const evalResult = evaluateRound1Answers(answersMap);

    // Record Submission
    await Round1Submission.create({
      studentId: student._id,
      answers: answersMap,
      score: evalResult.score,
      correctCount: evalResult.correctCount,
      incorrectCount: evalResult.incorrectCount,
      unansweredCount: evalResult.unansweredCount,
      submittedAt: new Date()
    });

    // Update Student Document
    student.round1Score = evalResult.score;
    student.qualificationStatus = evalResult.qualificationStatus;
    student.round1Status = 'COMPLETED';
    student.round1SubmittedAt = new Date();
    await student.save();

    // STRICT PRIVACY: NEVER RETURN MARKS OR QUALIFICATION TO STUDENT!
    return res.status(200).json({
      success: true,
      status: 'COMPLETED',
      message: 'Round 1 completed successfully. Please wait for further instructions.'
    });

  } catch (error) {
    console.error('Submit Round 1 Error:', error);
    return res.status(500).json({ success: false, message: 'Server error submitting Round 1.' });
  }
};
