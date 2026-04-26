import { GoogleGenAI } from '@google/genai';
import pool from './db';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateInsights() {
  try {
    // 1. Gather all required metrics
    const [topContent, topPlatform, engagement, audience] = await Promise.all([
      pool.query(`
        SELECT c.title, e.views, e.likes 
        FROM content c 
        JOIN engagement e ON c.content_id = e.content_id 
        ORDER BY e.views DESC LIMIT 3
      `),
      pool.query(`
        SELECT p.name AS platform, 
               SUM(r.ad_revenue + r.sponsorship_amt + r.subscription_amt + r.donations) AS total
        FROM content c
        JOIN platforms p ON c.platform_id = p.platform_id
        JOIN revenue r ON c.content_id = r.content_id
        GROUP BY p.name
        ORDER BY total DESC LIMIT 1
      `),
      pool.query(`
        SELECT AVG((likes + comments + shares)::numeric * 100.0 / NULLIF(views, 0)) as avg_engagement 
        FROM engagement WHERE views > 0
      `),
      pool.query(`
        SELECT age_group, gender, SUM(total_users) AS audience_size 
        FROM audience 
        GROUP BY age_group, gender
        ORDER BY audience_size DESC LIMIT 2
      `)
    ]);

    const dataContext = `
      Creator Analytics Snapshot:
      Top Content: ${JSON.stringify(topContent.rows)}
      Top Performing Platform: ${JSON.stringify(topPlatform.rows)}
      Average Engagement Rate: ${parseFloat(engagement.rows[0].avg_engagement).toFixed(2)}%
      Primary Audience: ${JSON.stringify(audience.rows)}
    `;

    const prompt = `
      You are an expert Creator Manager and Analyst.
      Based on the following data, generate 3 strategic insights for the creator.
      Output the response strictly as a JSON object with this exact structure:
      {
        "insights": [
          {
            "category": "Platform Strategy" | "Content" | "Audience" | "Monetization",
            "title": "Short catchy title",
            "description": "2-3 sentences of actionable advice based specifically on the data."
          }
        ]
      }
      
      Data:
      ${dataContext}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return JSON.parse(response.text);

  } catch (err) {
    console.error('Error generating insights:', err);
    throw new Error('Failed to generate insights');
  }
}
