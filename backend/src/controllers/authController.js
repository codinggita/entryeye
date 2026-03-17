const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');
const { hashPassword } = require('../utils/auth');

/**
 * Register user
 * @route POST /api/auth/register
 */
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // 2. Hash password
    const hashedPassword = await hashPassword(password);

    // 3. Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'teacher', // Default role if not provided
    });

    // 4. Return success response
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email (explicitly select password because it's hidden by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Verify password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Generate JWT
    const payload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });

    // 4. Return success response
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
