import mongoose from 'mongoose';

const queueReportSchema = new mongoose.Schema({
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: [true, 'Station ID is required'],
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  vehiclesWaiting: {
    type: Number,
    required: [true, 'Number of vehicles waiting is required'],
    min: 0,
    max: 200
  },
  estimatedWaitMinutes: {
    type: Number,
    required: [true, 'Estimated wait time is required'],
    min: 0,
    max: 300
  },
  fuelAvailable: {
    type: Boolean,
    default: true
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'cng', 'ev'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    index: { expires: 0 } // TTL index — auto-delete after expiry
  }
}, {
  timestamps: true
});

// Compound index for efficient lookups
queueReportSchema.index({ stationId: 1, timestamp: -1 });
queueReportSchema.index({ stationId: 1, fuelType: 1, timestamp: -1 });

const QueueReport = mongoose.model('QueueReport', queueReportSchema);
export default QueueReport;
