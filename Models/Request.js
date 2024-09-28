const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Request Schema
const requestSchema = new Schema({
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  from: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  to: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  msg: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'rejected', 'accepted'],
    default: 'pending'
  },
  isCancelled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true  
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
