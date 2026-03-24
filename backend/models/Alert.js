const mongoose = require('mongoose');

const alertSchema = mongoose.Schema({
  deviceId: { type: String, required: true },
  location: { type: String, required: true },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
  },
}, { timestamps: true });

const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;
