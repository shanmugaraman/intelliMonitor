const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Ticket = require('./models/Ticket');
const Alert = require('./models/Alert');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const seedData = async () => {
  try {
    await connectDB();
    // Clear existing data
    await User.deleteMany();
    await Ticket.deleteMany();
    await Alert.deleteMany();
    const Area = require('./models/Area');
    await Area.deleteMany();

    console.log('Database Cleared');

    // Create Areas
    const areas = await Area.insertMany([
      { name: 'Sellur', description: 'Madurai' },
      { name: 'SIT College', description: 'Madurai' },
      { name: 'Anna Nagar', description: 'Madurai' },
      { name: 'KK Nagar', description: 'Madurai' },
      { name: 'Simulation Area', description: 'IoT Test Area' }
    ]);

    // Create Admin
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@intelli.com',
      password: 'password',
      role: 'Admin'
    });

    // Create Technicians
    const tech1 = await User.create({
      name: 'Sellur Tech',
      email: 'sellur@intelli.com',
      password: 'password',
      role: 'Technician',
      serviceArea: 'Sellur'
    });

    const tech2 = await User.create({
      name: 'SIT Tech',
      email: 'sit@intelli.com',
      password: 'password',
      role: 'Technician',
      serviceArea: 'SIT College'
    });

    const tech3 = await User.create({
      name: 'General Tech',
      email: 'tech@intelli.com',
      password: 'password',
      role: 'Technician',
      serviceArea: 'Simulation Area'
    });

    const regularUser = await User.create({
      name: 'Regular User',
      email: 'user@intelli.com',
      password: 'password',
      role: 'User'
    });

    console.log('Users created');

    // Create some tickets and alerts
    const ticket1 = await Ticket.create({
      deviceId: 'ESP32_SELLUR_01',
      description: 'Main Transformer Outage',
      location: 'Sellur',
      status: 'OPEN'
    });

    await Alert.create({
      deviceId: 'ESP32_SELLUR_01',
      location: 'Sellur',
      ticketId: ticket1._id
    });

    const ticket2 = await Ticket.create({
      deviceId: 'ESP32_SIT_01',
      description: 'Campus Substation Issue',
      location: 'SIT College',
      status: 'ASSIGNED',
      assignedTo: tech2._id
    });

    const ticket3 = await Ticket.create({
      deviceId: 'SIM_001',
      description: 'Simulation Test Power Alert',
      location: 'Simulation Area',
      status: 'IN_PROGRESS',
      assignedTo: tech3._id,
      workLogs: [{ startTime: new Date() }]
    });

    const ticket4 = await Ticket.create({
      deviceId: 'ESP32_ANNA_01',
      description: 'Restored service Anna Nagar',
      location: 'Anna Nagar',
      status: 'RESOLVED',
      assignedTo: tech1._id,
      totalWorkTimeMinutes: 45,
      resolvedAt: new Date()
    });

    const ticket5 = await Ticket.create({
      description: 'Manual report: Sparks from transformer near Sellur market',
      location: 'Sellur',
      status: 'OPEN',
      reportedBy: regularUser._id
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
