/**
 * controllers/authController.js
 * Handles user registration and login, returns JWT.
 */

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// Helper: sign JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

/**
 * POST /api/auth/register
 * Body: { name, email, password, role, specialization? }
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, specialization } = req.body;

    // Check duplicate email
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      specialization: specialization || '',
    });

    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        id:   user._id,
        name: user.name,
        email:user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns JWT + user object (no password).
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account deactivated. Contact admin.' });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id:             user._id,
        name:           user.name,
        email:          user.email,
        role:           user.role,
        specialization: user.specialization,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 */
exports.getMe = async (req, res) => {
  res.json({
    id:             req.user._id,
    name:           req.user.name,
    email:          req.user.email,
    role:           req.user.role,
    specialization: req.user.specialization,
  });
};
