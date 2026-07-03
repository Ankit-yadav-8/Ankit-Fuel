import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  action: {
    type: String,
    enum: ['queue_report', 'review', 'photo', 'referral', 'signup_bonus', 'redemption'],
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId // Can reference a Review, QueueReport, etc.
  }
}, {
  timestamps: true
});

rewardSchema.index({ userId: 1, createdAt: -1 });

const Reward = mongoose.model('Reward', rewardSchema);
export default Reward;
