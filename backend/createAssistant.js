const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const { hashPassword } = require('./src/utils/auth');

// Load environment variables
dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/entereye';

async function createAssistant() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // 2. Check if assistant already exists
    const assistantExists = await User.findOne({ email: 'assistant@test.com' });
    if (assistantExists) {
      console.log('Assistant user already exists');
      return;
    }

    // 3. Hash the password
    const hashedPassword = await hashPassword('password123');

    // 4. Create teacher user
    const assistantUser = new User({
      name: 'Assistant User',
      email: 'assistant@test.com',
      password: hashedPassword,
      role: 'assistant',
    });

    // 5. Save to database
    await assistantUser.save();
    console.log('Assistant created successfully');

  } catch (error) {
    console.error('Error creating teacher user:', error);
  } finally {
    // 6. Close DB connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

createAssistant();
