import { ROUND1_QUESTIONS_BACKEND } from '../data/questions/round1QuestionsBackend.js';
import { ROUND2_PROBLEMS_BACKEND } from '../data/questions/round2ProblemsBackend.js';

export const evaluateRound1Answers = (answersMap) => {
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  ROUND1_QUESTIONS_BACKEND.forEach((q) => {
    const studentAnswer = answersMap[q.id.toString()] ?? answersMap[q.id];

    if (studentAnswer === undefined || studentAnswer === null) {
      unansweredCount++;
    } else if (Number(studentAnswer) === q.correctIndex) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const score = correctCount; // 1 mark per correct answer (out of 30)
  const isQualified = score >= 15;

  return {
    score,
    correctCount,
    incorrectCount,
    unansweredCount,
    qualificationStatus: isQualified ? 'QUALIFIED' : 'NOT_QUALIFIED'
  };
};

export const calculateCodingQuestionScore = (questionId, passedCount, totalCount) => {
  const problem = ROUND2_PROBLEMS_BACKEND.find(p => p.id === Number(questionId));
  if (!problem || totalCount === 0) return 0;

  const maxPoints = problem.points || 20;
  const pointsPerCase = maxPoints / totalCount;
  return Math.round(passedCount * pointsPerCase);
};
