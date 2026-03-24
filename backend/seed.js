const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Ticket = require('./models/Ticket');
const Alert = require('./models/Alert');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    // Clear existing data
    await User.deleteMany();
    await Ticket.deleteMany();
    await Alert.deleteMany();

    console.log('Database Cleared');

    // Create Admin
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@intelli.com',
      password: 'password',
      role: 'Admin'
    });

    // Create Technicians
    const tech1 = await User.create({
      name: 'John Doe',
      email: 'john@intelli.com',
      password: 'password',
      role: 'Technician',
      serviceArea: 'Area_A'
    });

    const tech2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@intelli.com',
      password: 'password',
      role: 'Technician',
      serviceArea: 'Area_B'
    });

    console.log('Users created');

    // Create some tickets and alerts
    const ticket1 = await Ticket.create({
      deviceId: 'ESP32_001',
      location: 'Area_A',
      status: 'OPEN'
    });

    await Alert.create({
      deviceId: 'ESP32_001',
      location: 'Area_A',
      ticketId: ticket1._id
    });

    const ticket2 = await Ticket.create({
      deviceId: 'ESP32_002',
      location: 'Area_B',
      status: 'ASSIGNED',
      assignedTo: tech2._id
    });

    const ticket3 = await Ticket.create({
      deviceId: 'ESP32_003',
      location: 'Area_A',
      status: 'IN_PROGRESS',
      assignedTo: tech1._id,
      workLogs: [{ startTime: new Date() }]
    });

    const ticket4 = await Ticket.create({
      deviceId: 'ESP32_004',
      location: 'Area_C',
      status: 'RESOLVED',
      assignedTo: tech1._id,
      totalWorkTimeMinutes: 45,
      resolvedAt: new Date()
    });

    console.log('Tickets seeded');
    console.log('Seeding Successful!');
    process.exit();

  } catch (error) {
    console.error('Error with data seeding:', error);
    process.exit(1);
  }
};

seedData();
