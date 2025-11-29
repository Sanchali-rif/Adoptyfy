const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide pet name'],
    trim: true,
  },
  species: {
    type: String,
    required: [true, 'Please provide species'],
    enum: ['Dog', 'Cat', 'Other'],
  },
  breed: {
    type: String,
    required: [true, 'Please provide breed'],
  },
  age: {
    type: String,
    required: [true, 'Please provide age'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
  },
  images: [{
    type: String, // URLs to images
  }],
  status: {
    type: String,
    enum: ['available', 'pending', 'adopted'],
    default: 'available',
  },
  vaccinated: {
    type: Boolean,
    default: false,
  },
  neutered: {
    type: Boolean,
    default: false,
  },
  shelter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    city: String,
    state: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
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

// Update timestamp on save
petSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Pet', petSchema);