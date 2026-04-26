const pool = require('../db');
const bcrypt = require('bcrypt');

async function fixHashes() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);
    await pool.query('UPDATE users SET password = $1', [hash]);
    console.log('Dummy passwords successfully hashed to "password123"');
  } catch (err) {
    console.error('Failed to hash passwords:', err);
  } finally {
    process.exit(0);
  }
}

fixHashes();
