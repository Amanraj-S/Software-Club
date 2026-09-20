import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'ADMIN'
  }
}, {
  timestamps: true
});

export const Admin = mongoose.model('Admin', adminSchema);
