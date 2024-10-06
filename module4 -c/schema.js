const mongoose = require('mongoose');

module.exports = mongoose.model('temp_data', new mongoose.Schema({
  location: String,
  humidity: Number,
  temperature: Number
}));