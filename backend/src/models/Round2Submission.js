import mongoose from 'mongoose';

const round2SubmissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  score: {
    type: Number,
    required: true
  },
  problemsAttempted: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const Round2Submission = mongoose.model('Round2Submission', round2SubmissionSchema);
