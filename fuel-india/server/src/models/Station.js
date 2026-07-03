import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Station name is required'],
    trim: true,
    maxlength: 200
  },
  brand: {
    type: String,
    trim: true,
    default: 'Independent'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Coordinates are required']
    }
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  pincode: {
    type: String,
    trim: true
  },
  fuelTypes: [{
    type: String,
    enum: ['petrol', 'diesel', 'cng', 'ev']
  }],
  amenities: [{
    type: String,
    enum: ['restroom', 'food', 'atm', 'air', 'wifi', 'parking', 'shop', 'water']
  }],
  openingHours: {
    open: { type: String, default: '00:00' },
    close: { type: String, default: '23:59' },
    is24Hours: { type: Boolean, default: true }
  },
  contactPhone: {
    type: String,
    trim: true
  },
  priceList: {
    petrol: { type: Number, default: 0 },
    diesel: { type: Number, default: 0 },
    cng: { type: Number, default: 0 },
    evPerKwh: { type: Number, default: 0 }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  images: [{
    type: String
  }],
  evChargerTypes: [{
    type: String,
    enum: ['Type1', 'Type2', 'CCS', 'CHAdeMO', 'GB/T', 'Tesla']
  }],
  evChargingPower: {
    type: Number, // in kW
    default: 0
  }
}, {
  timestamps: true
});

// 2dsphere index for geospatial queries
stationSchema.index({ location: '2dsphere' });

// Text index for search
stationSchema.index({ name: 'text', brand: 'text', city: 'text', address: 'text' });

// Compound indexes for common queries
stationSchema.index({ fuelTypes: 1, city: 1 });
stationSchema.index({ brand: 1 });

const Station = mongoose.model('Station', stationSchema);
export default Station;
