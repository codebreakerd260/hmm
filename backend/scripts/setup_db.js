const pool = require('../db');

const setupDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Starting database setup...');
    
    // Begin transaction
    await client.query('BEGIN');

    console.log('Dropping existing tables...');
    await client.query(`
      DROP TABLE IF EXISTS conversion CASCADE;
      DROP TABLE IF EXISTS audience CASCADE;
      DROP TABLE IF EXISTS revenue CASCADE;
      DROP TABLE IF EXISTS engagement CASCADE;
      DROP TABLE IF EXISTS content CASCADE;
      DROP TABLE IF EXISTS platforms CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    console.log('Creating tables...');
    
    // 1. Users
    await client.query(`
      CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Platforms
    await client.query(`
      CREATE TABLE platforms (
        platform_id SERIAL PRIMARY KEY,
        name VARCHAR(50),
        type VARCHAR(50)
      );
    `);

    // 3. Content
    await client.query(`
      CREATE TABLE content (
        content_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        platform_id INT REFERENCES platforms(platform_id) ON DELETE CASCADE,
        title TEXT,
        content_type VARCHAR(50),
        upload_time TIMESTAMP,
        duration INT
      );
    `);

    // 4. Engagement
    await client.query(`
      CREATE TABLE engagement (
        content_id INT REFERENCES content(content_id) ON DELETE CASCADE,
        views INT DEFAULT 0,
        likes INT DEFAULT 0,
        comments INT DEFAULT 0,
        shares INT DEFAULT 0,
        PRIMARY KEY (content_id)
      );
    `);

    // 5. Revenue
    await client.query(`
      CREATE TABLE revenue (
        content_id INT REFERENCES content(content_id) ON DELETE CASCADE,
        ad_revenue DECIMAL(10, 2) DEFAULT 0.00,
        sponsorship_amt DECIMAL(10, 2) DEFAULT 0.00,
        subscription_amt DECIMAL(10, 2) DEFAULT 0.00,
        donations DECIMAL(10, 2) DEFAULT 0.00,
        brand_name VARCHAR(100),
        PRIMARY KEY (content_id)
      );
    `);

    // 6. Audience
    await client.query(`
      CREATE TABLE audience (
        content_id INT REFERENCES content(content_id) ON DELETE CASCADE,
        age_group VARCHAR(20),
        gender VARCHAR(10),
        location VARCHAR(100),
        total_users INT DEFAULT 0
      );
    `);

    // 7. Conversion
    await client.query(`
      CREATE TABLE conversion (
        content_id INT REFERENCES content(content_id) ON DELETE CASCADE,
        total_viewers INT DEFAULT 0,
        paying_users INT DEFAULT 0,
        conversion_rate DECIMAL(5, 2) DEFAULT 0.00,
        PRIMARY KEY (content_id)
      );
    `);

    console.log('Inserting dummy data...');

    // Insert Users
    const usersResult = await client.query(`
      INSERT INTO users (name, email, password) VALUES 
      ('Alice Creator', 'alice@example.com', 'hashedpassword123'),
      ('Bob Streamer', 'bob@example.com', 'hashedpassword456')
      RETURNING user_id;
    `);
    const aliceId = usersResult.rows[0].user_id;
    const bobId = usersResult.rows[1].user_id;

    // Insert Platforms
    const platformsResult = await client.query(`
      INSERT INTO platforms (name, type) VALUES 
      ('YouTube', 'Video'),
      ('Instagram', 'Shorts/Reels'),
      ('Twitch', 'Live Stream'),
      ('TikTok', 'Shorts')
      RETURNING platform_id;
    `);
    const ytId = platformsResult.rows[0].platform_id;
    const igId = platformsResult.rows[1].platform_id;
    const twitchId = platformsResult.rows[2].platform_id;

    // Insert Content
    const contentResult = await client.query(`
      INSERT INTO content (user_id, platform_id, title, content_type, upload_time, duration) VALUES 
      ($1, $2, '10 Tips for Better Setup', 'Long Video', '2023-10-01 18:00:00', 600),
      ($1, $3, 'Day in the life', 'Reel', '2023-10-05 12:00:00', 60),
      ($2, $4, 'Gaming Marathon Live', 'Stream', '2023-10-10 20:00:00', 7200),
      ($1, $2, 'Tech Review 2023', 'Long Video', '2023-10-15 19:00:00', 900)
      RETURNING content_id;
    `, [aliceId, ytId, igId, twitchId]);
    
    const c1 = contentResult.rows[0].content_id;
    const c2 = contentResult.rows[1].content_id;
    const c3 = contentResult.rows[2].content_id;
    const c4 = contentResult.rows[3].content_id;

    // Insert Engagement
    await client.query(`
      INSERT INTO engagement (content_id, views, likes, comments, shares) VALUES 
      ($1, 50000, 3000, 400, 150),
      ($2, 120000, 15000, 800, 3000),
      ($3, 15000, 2000, 500, 50),
      ($4, 75000, 4500, 600, 200);
    `, [c1, c2, c3, c4]);

    // Insert Revenue
    await client.query(`
      INSERT INTO revenue (content_id, ad_revenue, sponsorship_amt, subscription_amt, donations, brand_name) VALUES 
      ($1, 250.00, 500.00, 0.00, 10.00, 'TechGear'),
      ($2, 100.00, 0.00, 0.00, 0.00, NULL),
      ($3, 0.00, 0.00, 150.00, 300.00, NULL),
      ($4, 400.00, 1000.00, 0.00, 50.00, 'GadgetPro');
    `, [c1, c2, c3, c4]);

    // Insert Audience
    await client.query(`
      INSERT INTO audience (content_id, age_group, gender, location, total_users) VALUES 
      ($1, '18-24', 'Male', 'USA', 20000),
      ($1, '25-34', 'Female', 'UK', 15000),
      ($2, '13-17', 'Female', 'USA', 80000),
      ($3, '18-24', 'Male', 'Canada', 10000),
      ($4, '25-34', 'Male', 'USA', 35000);
    `, [c1, c2, c3, c4]);

    // Insert Conversion
    await client.query(`
      INSERT INTO conversion (content_id, total_viewers, paying_users, conversion_rate) VALUES 
      ($1, 50000, 50, 0.10),
      ($2, 120000, 10, 0.01),
      ($3, 15000, 300, 2.00),
      ($4, 75000, 150, 0.20);
    `, [c1, c2, c3, c4]);

    // Commit transaction
    await client.query('COMMIT');
    console.log('Database setup complete!');

  } catch (err) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error setting up database:', err);
  } finally {
    client.release();
    pool.end();
  }
};

setupDatabase();
