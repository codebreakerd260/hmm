const express = require('express');
const cors = require('cors');
require('dotenv').config();

const analyticsRoutes = require('./routes/analyticsRoutes');
const insightRoutes = require('./routes/insightRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('Creator Monetization Analytics API is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/insights', authMiddleware, insightRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
