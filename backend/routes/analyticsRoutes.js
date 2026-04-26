const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. GET /top-content
// Fetches best-performing content by joining content, revenue, and engagement
router.get('/top-content', async (req, res) => {
  try {
    const query = `
      SELECT c.title, c.content_type, p.name AS platform, e.views, 
             (r.ad_revenue + r.sponsorship_amt + r.subscription_amt + r.donations) AS total_revenue
      FROM content c
      JOIN platforms p ON c.platform_id = p.platform_id
      JOIN engagement e ON c.content_id = e.content_id
      JOIN revenue r ON c.content_id = r.content_id
      ORDER BY total_revenue DESC
      LIMIT 10;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching top content' });
  }
});

// 2. GET /top-platform
// Aggregates revenue and groups by platform
router.get('/top-platform', async (req, res) => {
  try {
    const query = `
      SELECT p.name AS platform, 
             SUM(r.ad_revenue + r.sponsorship_amt + r.subscription_amt + r.donations) AS total_revenue
      FROM content c
      JOIN platforms p ON c.platform_id = p.platform_id
      JOIN revenue r ON c.content_id = r.content_id
      GROUP BY p.name
      ORDER BY total_revenue DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching top platforms' });
  }
});

// 3. GET /top-audience
// Aggregates audience demographics
router.get('/top-audience', async (req, res) => {
  try {
    const query = `
      SELECT age_group, gender, SUM(total_users) AS audience_size
      FROM audience
      GROUP BY age_group, gender
      ORDER BY audience_size DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching top audience' });
  }
});

// 4. GET /best-time
// Analyzes upload time vs engagement (views)
router.get('/best-time', async (req, res) => {
  try {
    const query = `
      SELECT EXTRACT(HOUR FROM c.upload_time) AS hour_of_day, SUM(e.views) AS total_views
      FROM content c
      JOIN engagement e ON c.content_id = e.content_id
      GROUP BY hour_of_day
      ORDER BY total_views DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching best time' });
  }
});

// 5. GET /top-brands
// Lists most profitable brand sponsorships
router.get('/top-brands', async (req, res) => {
  try {
    const query = `
      SELECT brand_name, SUM(sponsorship_amt) AS total_sponsorship
      FROM revenue
      WHERE brand_name IS NOT NULL
      GROUP BY brand_name
      ORDER BY total_sponsorship DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching top brands' });
  }
});

// 6. GET /engagement-rate
// Calculates (likes + comments + shares) / views for content
router.get('/engagement-rate', async (req, res) => {
  try {
    const query = `
      SELECT c.title, e.views, e.likes, e.comments, e.shares,
             ROUND(((e.likes + e.comments + e.shares)::numeric / e.views) * 100, 2) AS engagement_rate_pct
      FROM content c
      JOIN engagement e ON c.content_id = e.content_id
      WHERE e.views > 0
      ORDER BY engagement_rate_pct DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching engagement rate' });
  }
});

// 7. GET /conversion-rate
// Calculates paying_users / total_viewers
router.get('/conversion-rate', async (req, res) => {
  try {
    const query = `
      SELECT c.title, cv.total_viewers, cv.paying_users, 
             ROUND((cv.paying_users::numeric / cv.total_viewers) * 100, 2) AS conversion_rate_pct
      FROM content c
      JOIN conversion cv ON c.content_id = cv.content_id
      WHERE cv.total_viewers > 0
      ORDER BY conversion_rate_pct DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching conversion rate' });
  }
});

module.exports = router;
