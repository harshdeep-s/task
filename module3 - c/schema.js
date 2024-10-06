const mongoose = require('mongoose');

module.exports = mongoose.model('room_data', new mongoose.Schema({
  id: String,
  name: String,
  address: String,
  time: Date,
  temperature: Number,
  humidity: Number,
  newtemp: Number,
  chairs_in_use: Number,
  timestamp: Date
}));