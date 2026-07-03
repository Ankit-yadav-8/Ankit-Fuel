import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  photos: [{
    type: String // URL or path
  }],
  reportedPrice: {
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'cng', 'ev']
    },
    price: Number
  }
}, {
  timestamps: true
});

// One review per user per station
reviewSchema.index({ stationId: 1, userId: 1 }, { unique: true });

// After save: recalculate station average rating
reviewSchema.post('save', async function() {
  const Review = this.constructor;
  const Station = mongoose.model('Station');

  const stats = await Review.aggregate([
    { $match: { stationId: this.stationId } },
    {
      $group: {
        _id: '$stationId',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Station.findByIdAndUpdate(this.stationId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count
    });
  }
});

// After delete: recalculate station average rating
reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const Review = mongoose.model('Review');
    const Station = mongoose.model('Station');

    const stats = await Review.aggregate([
      { $match: { stationId: doc.stationId } },
      {
        $group: {
          _id: '$stationId',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await Station.findByIdAndUpdate(doc.stationId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        reviewCount: stats[0].count
      });
    } else {
      await Station.findByIdAndUpdate(doc.stationId, {
        rating: 0,
        reviewCount: 0
      });
    }
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
