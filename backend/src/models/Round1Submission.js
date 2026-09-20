import mongoose from 'mongoose';

const round1SubmissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  answers: {
    type: Map,
    of: Number, // questionId (key) -> selectedOption index (value)
    default: {}
  },
  score: {
    type: Number,
    required: true
  },
  correctCount: {
    type: Number,
    required: true
  },
  incorrectCount: {
    type: Number,
    required: true
  },
  unansweredCount: {
    type: Number,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const Round1Submission = mongoose.model('Round1Submission', round1SubmissionSchema);
