import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  registerNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true,
    trim: true
  },
  examSessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  round1Status: {
    type: String,
    enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'],
    default: 'NOT_STARTED'
  },
  round1StartedAt: {
    type: Date,
    default: null
  },
  round1SubmittedAt: {
    type: Date,
    default: null
  },
  round1Score: {
    type: Number,
    default: 0
  },
  qualificationStatus: {
    type: String,
    enum: ['PENDING', 'QUALIFIED', 'NOT_QUALIFIED'],
    default: 'PENDING'
  },
  round2Access: {
    type: String,
    enum: ['LOCKED', 'GRANTED', 'REVOKED'],
    default: 'LOCKED'
  },
  round2AccessGrantedAt: {
    type: Date,
    default: null
  },
  round2AccessGrantedBy: {
    type: String,
    default: null
  },
  round2Status: {
    type: String,
    enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'],
    default: 'NOT_STARTED'
  },
  round2StartedAt: {
    type: Date,
    default: null
  },
  round2SubmittedAt: {
    type: Date,
    default: null
  },
  round2Score: {
    type: Number,
    default: 0
  },
  finalScore: {
    type: Number,
    default: 0
  },
  violationCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const Student = mongoose.model('Student', studentSchema);
