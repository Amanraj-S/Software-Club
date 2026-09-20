import mongoose from 'mongoose';

const violationLogSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  round: {
    type: String,
    enum: ['ROUND_1', 'ROUND_2'],
    required: true
  },
  eventType: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const ViolationLog = mongoose.model('ViolationLog', violationLogSchema);
