const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
// Authenticates user and returns JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const user = userResult.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    // Return JWT
    const payload = {
      user_id: user.user_id,
      email: user.email,
      name: user.name
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret_123',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: payload });
      }
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// DEV ONLY: Helper to hash passwords for our dummy data
router.get('/fix-hashes', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);
    
    await pool.query('UPDATE users SET password = $1', [hash]);
    res.json({ message: 'Dummy passwords updated to "password123"' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update hashes' });
  }
});

module.exports = router;
