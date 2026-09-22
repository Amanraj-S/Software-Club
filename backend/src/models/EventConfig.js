import mongoose from 'mongoose';

const eventConfigSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'global_config' },
    round1Enabled: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const EventConfig = mongoose.model('EventConfig', eventConfigSchema);
