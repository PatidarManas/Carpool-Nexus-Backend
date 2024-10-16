import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: false,
  },
  dob: {
    type: Date,
    required: true
  },
  isWhatsapp: {
    type: Boolean,
    default: false,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isDocVerified: {
    type: Boolean,
    default: false
  },
  
  rides: {
    type: [String],  // Array of ride IDs or references to a Ride model
    default: [],
  },
  requests: {
    type: [String],  // Array of request IDs or references to a Request model
    default: [],
  },
  rating: {
    type: Number,
    default: 0,
  },
  ratingArray: {
    type: [Number],  // Store ratings provided by other users
    default: [],
  },
  notifications: {
    type: [String],  // Array of notification messages or references to a Notification model
    default: [],
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  walletHistory: {
    type: [Object],  // Array of transactions (could store amount, date, type)
    default: [],
  },
  ratingProvided: {
    type: [String],  // Array of ratings user has given to others (e.g., ride IDs)
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update 'updatedAt' field on save
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
