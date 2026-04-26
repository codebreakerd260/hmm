import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) {
  const { type } = await params;
  
  try {
    let result;
    
    switch (type) {
      case 'top-content':
        result = await pool.query(`
          SELECT c.title, c.content_type, p.name AS platform, e.views, 
                 (r.ad_revenue + r.sponsorship_amt + r.subscription_amt + r.donations) AS total_revenue
          FROM content c
          JOIN platforms p ON c.platform_id = p.platform_id
          JOIN engagement e ON c.content_id = e.content_id
          JOIN revenue r ON c.content_id = r.content_id
          ORDER BY total_revenue DESC
          LIMIT 10;
        `);
        break;
      case 'top-platform':
        result = await pool.query(`
          SELECT p.name AS platform, 
                 SUM(r.ad_revenue + r.sponsorship_amt + r.subscription_amt + r.donations) AS total_revenue
          FROM content c
          JOIN platforms p ON c.platform_id = p.platform_id
          JOIN revenue r ON c.content_id = r.content_id
          GROUP BY p.name
          ORDER BY total_revenue DESC;
        `);
        break;
      case 'top-audience':
        result = await pool.query(`
          SELECT age_group, gender, SUM(total_users) AS audience_size
          FROM audience
          GROUP BY age_group, gender
          ORDER BY audience_size DESC;
        `);
        break;
      case 'best-time':
        result = await pool.query(`
          SELECT EXTRACT(HOUR FROM c.upload_time) AS hour_of_day, SUM(e.views) AS total_views
          FROM content c
          JOIN engagement e ON c.content_id = e.content_id
          GROUP BY hour_of_day
          ORDER BY total_views DESC;
        `);
        break;
      case 'top-brands':
        result = await pool.query(`
          SELECT brand_name, SUM(sponsorship_amt) AS total_sponsorship
          FROM revenue
          WHERE brand_name IS NOT NULL
          GROUP BY brand_name
          ORDER BY total_sponsorship DESC;
        `);
        break;
      case 'engagement-rate':
        result = await pool.query(`
          SELECT c.title, e.views, e.likes, e.comments, e.shares,
                 ROUND(((e.likes + e.comments + e.shares)::numeric / NULLIF(e.views, 0)) * 100, 2) AS engagement_rate_pct
          FROM content c
          JOIN engagement e ON c.content_id = e.content_id
          WHERE e.views > 0
          ORDER BY engagement_rate_pct DESC;
        `);
        break;
      case 'conversion-rate':
        result = await pool.query(`
          SELECT c.title, cv.total_viewers, cv.paying_users, 
                 ROUND((cv.paying_users::numeric / NULLIF(cv.total_viewers, 0)) * 100, 2) AS conversion_rate_pct
          FROM content c
          JOIN conversion cv ON c.content_id = cv.content_id
          WHERE cv.total_viewers > 0
          ORDER BY conversion_rate_pct DESC;
        `);
        break;
      default:
        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 });
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(`Error in /api/analytics/${type}:`, error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
