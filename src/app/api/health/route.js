import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'all working',
    service: 'UWOConnect Frontend API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
}
