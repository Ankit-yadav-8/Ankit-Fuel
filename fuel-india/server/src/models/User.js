import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  passwordHash: {
    type: String,
    select: false
  },
  authProvider: {
    type: String,
    enum: ['email', 'google', 'phone'],
    default: 'email'
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String,
    default: ''
  },
  vehicleType: {
    type: String,
    enum: ['car', 'bike', 'truck', 'auto', 'bus', 'other'],
    default: 'car'
  },
  preferredFuel: {
    type: String,
    enum: ['petrol', 'diesel', 'cng', 'ev'],
    default: 'petrol'
  },
  savedRoutes: [{
    name: String,
    origin: {
      lat: Number,
      lng: Number,
      address: String
    },
    destination: {
      lat: Number,
      lng: Number,
      address: String
    },
    createdAt: { type: Date, default: Date.now }
  }],
  rewardPoints: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  otp: {
    code: String,
    expiresAt: Date
  }
}, {
  timestamps: true
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash') || !this.passwordHash) return next();
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove sensitive fields from JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.otp;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
