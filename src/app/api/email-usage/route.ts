import { NextResponse } from 'next/server';

interface EmailUsage {
  service: string;
  lastActivityDate: string;
  activityCount: number;
  source: 'gmail' | 'browser';
}

export async function GET() {
  return NextResponse.json({
    connected: false,
    message: 'Gmail integration not configured. Add Google API credentials to enable.',
    providers: [
      { name: 'Gmail', status: 'disconnected', requiredScopes: ['gmail.readonly'] },
      { name: 'Browser Extension', status: 'disconnected', requiredAction: 'Install Chrome extension' },
    ],
    mockData: [
      { service: 'Netflix', lastActivityDate: '2026-03-17', activityCount: 12, source: 'gmail' as const },
      { service: 'Spotify', lastActivityDate: '2026-03-18', activityCount: 28, source: 'gmail' as const },
      { service: 'Adobe', lastActivityDate: '2026-03-01', activityCount: 3, source: 'gmail' as const },
    ] as EmailUsage[]
  });
}

export async function POST() {
  return NextResponse.json({
    error: 'Gmail API integration requires OAuth setup. See documentation for credentials.',
    setupRequired: [
      '1. Go to Google Cloud Console',
      '2. Enable Gmail API',
      '3. Create OAuth credentials',
      '4. Add credentials to .env.local',
    ]
  }, { status: 501 });
}
