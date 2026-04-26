import { NextResponse } from 'next/server';
import { generateInsights } from '@/lib/insightService';

export async function GET() {
  try {
    const insights = await generateInsights();
    return NextResponse.json(insights);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
  }
}
