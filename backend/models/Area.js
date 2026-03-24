const mongoose = require('mongoose');

const areaSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }
}, { timestamps: true });

const Area = mongoose.model('Area', areaSchema);
module.exports = Area;
