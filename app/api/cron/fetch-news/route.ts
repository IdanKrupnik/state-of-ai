import { NextResponse } from 'next/server';
import { handleNewsIngestion } from '@/src/lib/newsIngestionService';

export async function GET(req: Request) {
  return handleNewsIngestion(req);
}

export async function POST(req: Request) {
  return handleNewsIngestion(req);
}
