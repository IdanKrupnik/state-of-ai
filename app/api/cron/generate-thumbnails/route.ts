import { NextResponse } from 'next/server';
import { runThumbnailCron } from '@/src/lib/thumbnailService';

function isAuthorized(req: Request): boolean {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'test_secret';
  return authHeader === `Bearer ${cronSecret}`;
}

async function handleThumbnailSync(req: Request): Promise<NextResponse> {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await runThumbnailCron();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in thumbnail generation workflow:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return handleThumbnailSync(req);
}

export async function POST(req: Request) {
  return handleThumbnailSync(req);
}
