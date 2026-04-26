const express = require('express');
const router = express.Router();
const insightService = require('../services/insightService');

// GET /api/insights
// Triggers the Gemini AI to generate insights based on DB metrics
router.get('/', async (req, res) => {
  try {
    const insights = await insightService.generateInsights();
    res.json({ insights });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching insights' });
  }
});

module.exports = router;
