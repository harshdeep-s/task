const mongoose = require('mongoose');

module.exports = mongoose.model('Sensor', new mongoose.Schema({
  id: Number,
  temperature: Number,
  humidity: Number
}));