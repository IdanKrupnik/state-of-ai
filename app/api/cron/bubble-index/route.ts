import { NextResponse } from 'next/server';
import { runBubbleIngestion } from '@/lib/bubbleIngestion';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'test_secret';

    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await runBubbleIngestion();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in bubble-index cron route:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return GET(req);
}
