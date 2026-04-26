const { GoogleGenAI } = require('@google/genai');
const pool = require('../db');

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateInsights = async () => {
  try {
    // 1. Gather Data Context from DB
    // Fetch top content
    const contentQuery = `
      SELECT c.title, c.content_type, p.name AS platform, e.views, 
             (r.ad_revenue + r.sponsorship_amt + r.subscription_amt + r.donations) AS total_revenue
      FROM content c
      JOIN platforms p ON c.platform_id = p.platform_id
      JOIN engagement e ON c.content_id = e.content_id
      JOIN revenue r ON c.content_id = r.content_id
      ORDER BY total_revenue DESC LIMIT 3;
    `;
    const topContent = await pool.query(contentQuery);

    // Fetch audience data
    const audienceQuery = `
      SELECT age_group, gender, SUM(total_users) AS audience_size
      FROM audience
      GROUP BY age_group, gender
      ORDER BY audience_size DESC LIMIT 3;
    `;
    const topAudience = await pool.query(audienceQuery);

    // Fetch optimal posting times
    const timeQuery = `
      SELECT EXTRACT(HOUR FROM c.upload_time) AS hour_of_day, SUM(e.views) AS total_views
      FROM content c
      JOIN engagement e ON c.content_id = e.content_id
      GROUP BY hour_of_day
      ORDER BY total_views DESC LIMIT 3;
    `;
    const bestTimes = await pool.query(timeQuery);

    // Fetch platform revenue
    const platformQuery = `
      SELECT p.name AS platform, SUM(r.ad_revenue + r.sponsorship_amt + r.subscription_amt + r.donations) AS total_revenue
      FROM content c
      JOIN platforms p ON c.platform_id = p.platform_id
      JOIN revenue r ON c.content_id = r.content_id
      GROUP BY p.name
      ORDER BY total_revenue DESC;
    `;
    const platformRevenue = await pool.query(platformQuery);

    // 2. Construct the prompt for Gemini
    const prompt = `
      You are an expert Content Creator Monetization Analyst. Your goal is to analyze the following aggregated metrics from a creator's database and generate 3 highly actionable, strategic insights to help them maximize their revenue and engagement.
      
      Here is the data:
      Top Content by Revenue: ${JSON.stringify(topContent.rows)}
      Top Audience Demographics: ${JSON.stringify(topAudience.rows)}
      Best Upload Times (Hours of Day): ${JSON.stringify(bestTimes.rows)}
      Revenue by Platform: ${JSON.stringify(platformRevenue.rows)}

      Analyze this data and return exactly 3 actionable insights in JSON format. Do not use markdown wrapping around the JSON.
      Format:
      [
        {
          "title": "Short title of insight",
          "description": "Detailed strategic advice based on the data.",
          "category": "Platform Strategy" // or "Audience", "Timing", "Content"
        }
      ]
    `;

    // 3. Call Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const insightsJson = JSON.parse(response.text);
    return insightsJson;

  } catch (error) {
    console.error("Error generating insights:", error);
    throw new Error('Failed to generate insights');
  }
};

module.exports = { generateInsights };
