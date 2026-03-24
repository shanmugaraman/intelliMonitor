const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Alert = require('../models/Alert');

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, serviceArea } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'Technician',
    serviceArea
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const getAnalytics = asyncHandler(async (req, res) => {
  const totalTickets = await Ticket.countDocuments();
  const activeTickets = await Ticket.countDocuments({ status: { $ne: 'RESOLVED' } });
  const resolvedTickets = await Ticket.countDocuments({ status: 'RESOLVED' });
  
  const resolved = await Ticket.find({ status: 'RESOLVED' });
  let totalTime = 0;
  resolved.forEach(t => {
    if (t.resolvedAt) {
      const diff = t.resolvedAt.getTime() - t.createdAt.getTime();
      totalTime += diff;
    }
  });
  const avgResolutionTimeHours = resolved.length > 0 ? (totalTime / resolved.length / (1000 * 60 * 60)).toFixed(2) : 0;

  const statusCounts = await Ticket.aggregate([
    { $group: { _id: "$status", value: { $sum: 1 } } }
  ]);
  const statusDistribution = statusCounts.map(s => ({ name: s._id, value: s.value }));

  const locationCounts = await Ticket.aggregate([
    { $group: { _id: "$location", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  const locationDistribution = locationCounts.map(l => ({ name: l._id, Tickets: l.count }));

  const recentTickets = await Ticket.find().populate('assignedTo', 'name').sort({ createdAt: -1 }).limit(5);

  res.json({
    totalTickets,
    activeTickets,
    resolvedTickets,
    avgResolutionTimeHours,
    statusDistribution,
    locationDistribution,
    recentTickets
  });
});

const getLogs = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find().populate('assignedTo', 'name email').sort({ createdAt: -1 });
  const alerts = await Alert.find().sort({ createdAt: -1 });

  res.json({ tickets, alerts });
});

module.exports = { createUser, getAnalytics, getLogs };
