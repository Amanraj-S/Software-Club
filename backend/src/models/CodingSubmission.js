import mongoose from 'mongoose';

const codingSubmissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  questionId: {
    type: Number,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  testCasesTotal: {
    type: Number,
    default: 0
  },
  executionTime: {
    type: String,
    default: "0ms"
  },
  score: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

codingSubmissionSchema.index({ studentId: 1, questionId: 1 });

export const CodingSubmission = mongoose.model('CodingSubmission', codingSubmissionSchema);
