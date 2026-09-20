import { CodingSubmission } from '../models/CodingSubmission.js';
import { ROUND2_PROBLEMS_BACKEND } from '../data/questions/round2ProblemsBackend.js';
import { executePythonCode } from '../services/pythonExecutionService.js';
import { calculateCodingQuestionScore } from '../services/scoringService.js';

export const runCode = async (req, res) => {
  try {
    const student = req.student;
    const { questionId, code } = req.body;

    if (!questionId || code === undefined) {
      return res.status(400).json({ success: false, message: 'Question ID and code are required.' });
    }

    if (student.round2Access !== 'GRANTED') {
      return res.status(403).json({ success: false, message: 'Round 2 access is not granted.' });
    }

    const problem = ROUND2_PROBLEMS_BACKEND.find(p => p.id === Number(questionId));
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    // Execute strictly against PUBLIC test cases for execution run
    const result = await executePythonCode(code, problem, problem.publicTestCases);

    return res.status(200).json({
      success: true,
      testResults: result.testResults, // Only public test case feedback
      passedCount: result.passedCount,
      totalCount: result.totalCount,
      executionTime: `${result.executionTimeMs}ms`,
      error: result.error
    });

  } catch (error) {
    console.error('Run Code Error:', error);
    return res.status(500).json({ success: false, message: 'Execution error occurred.' });
  }
};

export const saveDraft = async (req, res) => {
  try {
    const student = req.student;
    const { questionId, code } = req.body;

    if (!questionId || code === undefined) {
      return res.status(400).json({ success: false, message: 'Question ID and code are required.' });
    }

    const problem = ROUND2_PROBLEMS_BACKEND.find(p => p.id === Number(questionId));
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    // Save or update submission in MongoDB
    let submission = await CodingSubmission.findOne({
      studentId: student._id,
      questionId: Number(questionId)
    });

    if (submission) {
      submission.code = code;
      submission.submittedAt = new Date();
      await submission.save();
    } else {
      submission = await CodingSubmission.create({
        studentId: student._id,
        questionId: Number(questionId),
        code,
        submittedAt: new Date()
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Draft code saved successfully.'
    });

  } catch (error) {
    console.error('Save Draft Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save draft code.' });
  }
};

export const getSavedSubmissions = async (req, res) => {
  try {
    const student = req.student;
    const submissions = await CodingSubmission.find({ studentId: student._id });

    const submissionMap = {};
    submissions.forEach(sub => {
      submissionMap[sub.questionId] = {
        code: sub.code,
        testCasesPassed: sub.testCasesPassed,
        testCasesTotal: sub.testCasesTotal,
        executionTime: sub.executionTime
      };
    });

    return res.status(200).json({
      success: true,
      submissions: submissionMap
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve saved code.' });
  }
};
