import mongoose from 'mongoose';
const { Schema } = mongoose;

// Ride Schema
const rideSchema = new Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
    required: true
  },
  from: {
    description: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  to: {
    description: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  stopovers: [
    {
      description: { type: String, required: true },
      location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    }
  ],
  path: [],
  carType: {
    type: String,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 1
  },
  alreadyOccupiedSeats: {
    type: Number,
    required: true
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
  basePrice: {
    type: Number,
    required: true
  },
  usePricePerStopover: {
    type: Boolean,
    default: false
  },
  stopoverPrices: {
    type: Map,
    of: Number,
    default: {}
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  msg: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Ride = mongoose.model('Ride', rideSchema);
export default Ride;
