import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'UWOConnect Frontend API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
}
