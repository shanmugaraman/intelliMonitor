const mongoose = require('mongoose');

const workLogSchema = mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  durationMinutes: { type: Number, default: 0 },
});

const ticketSchema = mongoose.Schema({
  deviceId: { type: String, default: 'MANUAL' },
  description: { type: String, required: true },
  location: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'], 
    default: 'OPEN' 
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  workLogs: [workLogSchema],
  totalWorkTimeMinutes: { type: Number, default: 0 },
  notes: { type: String },
  resolvedAt: { type: Date }
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
