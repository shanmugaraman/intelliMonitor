const asyncHandler = require('express-async-handler');
const Ticket = require('../models/Ticket');
const Alert = require('../models/Alert');
const User = require('../models/User');

const receivePowerAlert = asyncHandler(async (req, res) => {
  const { deviceId, location } = req.query;

  if (!deviceId || !location) {
    res.status(400);
    throw new Error('Device ID and Location required');
  }

  const alert = await Alert.create({ deviceId, location });

  const technicians = await User.find({ role: 'Technician', serviceArea: location });
  let assignedTo = null;
  let status = 'OPEN';

  if (technicians.length > 0) {
    assignedTo = technicians[Math.floor(Math.random() * technicians.length)]._id;
    status = 'ASSIGNED';
  }

  const ticket = await Ticket.create({
    deviceId,
    location,
    status,
    assignedTo
  });

  alert.ticketId = ticket._id;
  await alert.save();

  res.status(201).json({ message: 'Alert processed and ticket created', ticket });
});

const createTicket = asyncHandler(async (req, res) => {
  const { description, location } = req.body;

  if (!description || !location) {
    res.status(400);
    throw new Error('Description and Location required');
  }

  // Find technicians in the area
  const technicians = await User.find({ role: 'Technician', serviceArea: location });
  let assignedTo = null;
  let status = 'OPEN';

  if (technicians.length > 0) {
    assignedTo = technicians[Math.floor(Math.random() * technicians.length)]._id;
    status = 'ASSIGNED';
  }

  const ticket = await Ticket.create({
    description,
    location,
    status,
    assignedTo,
    reportedBy: req.user._id
  });

  res.status(201).json(ticket);
});

const getAssignedTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ assignedTo: req.user._id }).sort({ createdAt: -1 });
  res.json(tickets);
});

const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
  res.json(tickets);
});

const startWork = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  if (ticket.assignedTo.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not assigned to this ticket');
  }

  const activeLog = ticket.workLogs.some(log => !log.endTime);
  if (activeLog) {
    res.status(400);
    throw new Error('Work already started');
  }

  ticket.status = 'IN_PROGRESS';
  ticket.workLogs.push({ startTime: new Date() });
  await ticket.save();

  res.json(ticket);
});

const stopWork = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  const activeLogIndex = ticket.workLogs.findIndex(log => !log.endTime);
  if (activeLogIndex === -1) {
    res.status(400);
    throw new Error('No active work session');
  }

  const endTime = new Date();
  const startTime = ticket.workLogs[activeLogIndex].startTime;
  const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));

  ticket.workLogs[activeLogIndex].endTime = endTime;
  ticket.workLogs[activeLogIndex].durationMinutes = durationMinutes;
  ticket.totalWorkTimeMinutes += durationMinutes;
  
  await ticket.save();
  res.json(ticket);
});

const resolveTicket = asyncHandler(async (req, res) => {
  const { id, notes } = req.body;
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  const activeLogIndex = ticket.workLogs.findIndex(log => !log.endTime);
  if (activeLogIndex !== -1) {
    const endTime = new Date();
    const durationMinutes = Math.round((endTime - ticket.workLogs[activeLogIndex].startTime) / (1000 * 60));
    ticket.workLogs[activeLogIndex].endTime = endTime;
    ticket.workLogs[activeLogIndex].durationMinutes = durationMinutes;
    ticket.totalWorkTimeMinutes += durationMinutes;
  }

  ticket.status = 'RESOLVED';
  ticket.notes = notes || ticket.notes;
  ticket.resolvedAt = new Date();
  
  await ticket.save();
  res.json(ticket);
});

module.exports = { receivePowerAlert, getAssignedTickets, startWork, stopWork, resolveTicket, createTicket, getMyTickets };
