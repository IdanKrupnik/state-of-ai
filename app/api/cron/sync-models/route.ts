import { NextResponse } from 'next/server';
import { syncModels } from '@/src/lib/modelsSyncService';

export async function GET(req: Request) {
  return syncModels(req);
}

export async function POST(req: Request) {
  return syncModels(req);
}
