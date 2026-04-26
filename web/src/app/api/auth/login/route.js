import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid Credentials' }, { status: 400 });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid Credentials' }, { status: 400 });
    }

    const payload = {
      user_id: user.user_id,
      email: user.email,
      name: user.name
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'super_secret_jwt_key_123',
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token, user: payload });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
