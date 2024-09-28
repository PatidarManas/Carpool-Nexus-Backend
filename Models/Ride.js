const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Ride Schema
const rideSchema = new Schema({
  createdBy: {
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
  stopovers: [
    {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  ],
  path: [
    {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  ],
  
  availableSeats: {
    type: Number,
    required: true,
    min: 1
  },
  bookedSeats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request'
    }
  ],
  when: {
    type: Date,
    required: true
  },
  petsAllowed: {
    type: Boolean,
    default: false
  },
  smokingAllowed: {
    type: Boolean,
    default: false
  },
  childrenAllowed: {
    type: Boolean,
    default: true
  },
  preference: {
    type: String,
    enum: ['any', 'only men', 'only female'],
    default: 'any'
  },
  msg: {
    type: String,
    default: ''
  }
}, {
  timestamps: true 
});

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
