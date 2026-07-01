import { NextResponse } from 'next/server';
import { handleNewsSync } from '@/src/lib/newsService';

export async function GET(req: Request) {
  return handleNewsSync(req);
}

export async function POST(req: Request) {
  return handleNewsSync(req);
}
