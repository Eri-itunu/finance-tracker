import { NextResponse } from 'next/server';
import { generateInsights } from '@/lib/ai';

export async function GET() {
  try {
    const data = await generateInsights();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to generate insights' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = typeof body?.prompt === 'string' ? body.prompt : undefined;
    const data = await generateInsights(prompt);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to generate insights' }, { status: 500 });
  }
}
