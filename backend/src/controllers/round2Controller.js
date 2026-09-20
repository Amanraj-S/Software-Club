import { Student } from '../models/Student.js';
import { Round2Submission } from '../models/Round2Submission.js';
import { CodingSubmission } from '../models/CodingSubmission.js';
import { getStudentRound2Problems, ROUND2_PROBLEMS_BACKEND } from '../data/questions/round2ProblemsBackend.js';
import { executePythonCode } from '../services/pythonExecutionService.js';
import { calculateCodingQuestionScore } from '../services/scoringService.js';

export const getRound2Access = async (req, res) => {
  try {
    const student = req.student;

    return res.status(200).json({
      success: true,
      accessState: student.round2Access, // 'LOCKED', 'GRANTED', 'REVOKED'
      statusState: student.round2Status, // 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'
      round2StartedAt: student.round2StartedAt,
      durationMinutes: 90
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error checking Round 2 access.' });
  }
};

export const startRound2 = async (req, res) => {
  try {
    const student = req.student;

    // Strict backend security validations
    if (student.round1Status !== 'COMPLETED') {
      return res.status(403).json({
        success: false,
        message: 'You must complete Round 1 first.'
      });
    }

    if (student.round2Access !== 'GRANTED') {
      return res.status(403).json({
        success: false,
        message: 'Round 2 access has not been granted by the administrator.'
      });
    }

    if (student.round2Status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Round 2 has already been completed.'
      });
    }

    if (student.round2Status === 'NOT_STARTED') {
      student.round2Status = 'IN_PROGRESS';
      student.round2StartedAt = new Date();
      await student.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Round 2 coding challenge started.',
      round2StartedAt: student.round2StartedAt,
      durationMinutes: 90
    });

  } catch (error) {
    console.error('Start Round 2 Error:', error);
    return res.status(500).json({ success: false, message: 'Server error starting Round 2.' });
  }
};

export const getRound2Questions = async (req, res) => {
  try {
    const student = req.student;

    if (student.round2Access !== 'GRANTED') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const questions = getStudentRound2Problems();
    return res.status(200).json({
      success: true,
      questions
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load coding problems.' });
  }
};

export const submitRound2 = async (req, res) => {
  try {
    const student = req.student;

    if (student.round2Access !== 'GRANTED') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (student.round2Status === 'COMPLETED') {
      return res.status(200).json({
        success: true,
        message: 'Round 2 completed successfully.'
      });
    }

    // Evaluate all 5 problems for the student (combining public + hidden test cases)
    const savedSubmissions = await CodingSubmission.find({ studentId: student._id });
    let totalRound2Score = 0;
    let problemsAttemptedCount = savedSubmissions.length;

    for (const problem of ROUND2_PROBLEMS_BACKEND) {
      const existingSub = savedSubmissions.find(s => s.questionId === problem.id);

      if (existingSub && existingSub.code) {
        // Evaluate against ALL test cases (public + hidden)
        const allTestCases = [...problem.publicTestCases, ...problem.hiddenTestCases];
        const evalResult = await executePythonCode(existingSub.code, problem, allTestCases);

        const qScore = calculateCodingQuestionScore(problem.id, evalResult.passedCount, evalResult.totalCount);
        totalRound2Score += qScore;

        // Update coding submission score
        existingSub.testCasesPassed = evalResult.passedCount;
        existingSub.testCasesTotal = evalResult.totalCount;
        existingSub.score = qScore;
        existingSub.executionTime = `${evalResult.executionTimeMs}ms`;
        await existingSub.save();
      }
    }

    const finalCalculatedScore = (student.round1Score || 0) + totalRound2Score;

    // Create Round2Submission record
    await Round2Submission.create({
      studentId: student._id,
      score: totalRound2Score,
      problemsAttempted: problemsAttemptedCount,
      submittedAt: new Date()
    });

    // Update Student Document
    student.round2Score = totalRound2Score;
    student.finalScore = finalCalculatedScore;
    student.round2Status = 'COMPLETED';
    student.round2SubmittedAt = new Date();
    await student.save();

    // STRICT PRIVACY: DO NOT RETURN MARKS OR RANK!
    return res.status(200).json({
      success: true,
      message: 'Round 2 completed successfully.'
    });

  } catch (error) {
    console.error('Submit Round 2 Error:', error);
    return res.status(500).json({ success: false, message: 'Server error submitting Round 2.' });
  }
};
