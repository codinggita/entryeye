require('dotenv').config();
const mongoose = require('mongoose');
const Batch = require('./src/models/Batch');

const createBatch = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 2. Create batch
    const batchData = {
      name: 'CS 2024',
      year: 2024,
      course: 'Computer Science',
    };

    const batch = new Batch(batchData);
    await batch.save();

    console.log('Batch created successfully');
  } catch (error) {
    console.error('Error creating batch:', error.message);
  } finally {
    // 3. Close connection
    await mongoose.connection.close();
    process.exit();
  }
};

createBatch();
